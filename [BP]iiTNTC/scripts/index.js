/*
|
| TNT Coin for Minecraft Bedrock
|
| Author: Rqinix
| Version: 1.1.0
| Source Code: https://github.com/rqinix/TNTCoin
|
*/
import { system, world } from "@minecraft/server";
import { floorVector3 } from "./game/utilities/math/floorVector";
import { GUI_ITEM, RANDOM_BLOCK_ITEM } from "./config/config";
import { INGAME_PLAYERS, TNTCoinGUI } from "./game/TNTCoinGui";
import { getRandomBlock } from "./game/utilities/blocks/randomBlock";
/**
 * Shows the TNT Coin GUI when a player uses the designated GUI item.
 */
world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const usedItem = event.itemStack.typeId;
    if (usedItem === GUI_ITEM) {
        const game = INGAME_PLAYERS.get(player.name) ?? new TNTCoinGUI(player);
        game.showForm();
    }
});
/**
 * Prevents players from breaking protected blocks.
 */
world.beforeEvents.playerBreakBlock.subscribe(event => {
    const block = event.block;
    const blockLocation = JSON.stringify(floorVector3(block.location));


    const player = event.player;
    const gui = INGAME_PLAYERS.get(player.name);
    if (gui?.game.isPlayerInGame && gui.game.structure.protectedBlockLocations.has(blockLocation)) {
        event.cancel = true;
        system.run( ()=>{
        player.playSound("note.bell");
        });
    }
});
/**
 * Prevents explosions from destroying protected blocks.
 */
world.beforeEvents.explosion.subscribe(event => {
    const impactedBlocks = event.getImpactedBlocks();
    if (impactedBlocks.length === 0) return;

    // 計算爆炸中心（用第一個方塊作爆心）
    const center = impactedBlocks[0].location;

    // 找最近玩家
    const players = world.getAllPlayers();
    if (players.length === 0) return;

    let nearestPlayer = players[0];
    let nearestDist = Infinity;

    for (const p of players) {
        const dx = p.location.x - center.x;
        const dy = p.location.y - center.y;
        const dz = p.location.z - center.z;
        const distSq = dx*dx + dy*dy + dz*dz;
        if (distSq < nearestDist) {
            nearestDist = distSq;
            nearestPlayer = p;
        }
    }

    // 拿最近玩家的保護方塊
    const gui = INGAME_PLAYERS.get(nearestPlayer.name);
    if (!gui?.game.isPlayerInGame) return;

    const nearestProtected = gui.game.structure.protectedBlockLocations;
    
    const filteredBlocks = impactedBlocks.filter(block => {
        const key = JSON.stringify(floorVector3(block.location));
        return !nearestProtected.has(key);
    });


    // 過濾爆炸方塊，只保護最近玩家的結構方塊
    // 更新事件的方塊列表
    event.setImpactedBlocks(filteredBlocks);

});
/**
 * Loads the game state for players who are in a game when they spawn.
 */
world.afterEvents.playerSpawn.subscribe(async (event) => {
    const player = event.player;
    const playerName = player.name;
    try {
        const gameState = player.getDynamicProperty("TNTCoinGameState");
        const parsedState = JSON.parse(gameState);
        if (parsedState.isPlayerInGame) {
            const gui = new TNTCoinGUI(player);
            INGAME_PLAYERS.set(playerName, gui);
            await gui.game.loadGame();
        }
    }
    catch (error) {
        console.error(`No game state found or failed to load for player ${playerName}: ${error.message}`);
    }
});


//爆炸後事件
world.afterEvents.explosion.subscribe(event => {
    const impactedBlocks = event.getImpactedBlocks();
    if (impactedBlocks.length === 0) return;

    // ✅ 直接取第一個 block 當爆炸中心
    const center = impactedBlocks[0].location;

    // ✅ 找最近的玩家
    const players = world.getPlayers();
    if (players.length === 0) return;

    let nearestPlayer = players[0];
    let nearestDist = Infinity;

    for (const p of players) {
        const dx = p.location.x - center.x;
        const dy = p.location.y - center.y;
        const dz = p.location.z - center.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < nearestDist) {
            nearestDist = distSq;
            nearestPlayer = p;
        }
    }

    const gui = INGAME_PLAYERS.get(nearestPlayer.name);
    if (!gui?.game.isPlayerInGame) return;
    
    //nearestPlayer.sendMessage(nearestPlayer.name)
    
    const structure = gui.game.structure;
    const impactedKeys = impactedBlocks.map(b => JSON.stringify(floorVector3(b.location)) );

    // 批量更新 filledBlockLocations
    structure.updateFilledBlock(impactedBlocks)
    
});

//世界方塊破壞事件更新

world.afterEvents.playerBreakBlock.subscribe(event => {
         
    const player = event.player;
    const blockUsed = event.block.typeId;
    const block = event.block;
    const gui = INGAME_PLAYERS.get(player.name);
    
    if (!gui?.game.isPlayerInGame) return;
    // ✅ 更新結構內的填充狀態
    gui.game.structure.updateFilledBlock(block.location);
        
});
     
/**
 * Randomizes the block permutation when a player places a random block.
 */
world.afterEvents.playerPlaceBlock.subscribe(event => {
    const player = event.player;
    const blockUsed = event.block.typeId;
    const block = event.block;
    const gui = INGAME_PLAYERS.get(player.name);
    
    //const fillMax=gui.game.structure.filledBlockLocations.size + gui.game.structure.airBlockLocations.length
    //player.sendMessage(`${gui.game.structure.filledBlockLocations.size}/${fillMax}`)
    
    if (!gui?.game.isPlayerInGame) return;

    // ✅ 更新結構內的填充狀態
    gui.game.structure.updateFilledBlock(block.location);

    // 🎲 隨機方塊替換邏輯
    if (gui.game.settings.randomizeBlocks && blockUsed === RANDOM_BLOCK_ITEM) {
        try {
            const randomBlockType = getRandomBlock();
            player.dimension.setBlockType(block.location, randomBlockType);
        }
        catch (error) {
            system.run( ()=>{
            player.sendMessage(`§4Failed to place random block: ${error.message}`);
            player.playSound('note.bell');
            });
        }
    }

});
/**
 * Handles script events for TNTCoin
 */
system.afterEvents.scriptEventReceive.subscribe((event) => {
    world.getAllPlayers().forEach(player => {
        const gui = INGAME_PLAYERS.get(player.name);
        if (event.id === 'tntcoin:connected') {
            const tiktokUserName = JSON.parse(event.message).tiktokUserName;
            player.onScreenDisplay.setTitle(`§aWelcome\nto\n§cTNT§f §eCoin§f\n§b${tiktokUserName}§a!`);
        }
        if (gui?.game.isPlayerInGame)
            gui.game.handleScriptEvents(event);
    });
}, { namespaces: ['tntcoin'] });
