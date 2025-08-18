import { taskManager } from "../../../core/TaskManager";
import { onMaxWin } from "./onMaxWin";
/**
 * Handles the event when the player wins the game.
 * @param {TNTCoin} game - The current instance of the TNTCoin game.
 * @returns {Promise<void>} - A promise that resolves when the player wins the game.
 */
export async function onWin(game) {
    game.winManager.incrementWin();
    const isMaxWin = game.winManager.hasReachedMaxWins();
    if (isMaxWin) {
        onMaxWin(game);
        return;
    }
    const TITLE = `§a${game.winManager.getCurrentWins()}§f/§a${game.winManager.getMaxWins()}`;
    const SUBTITLE = '§eYou win!§r';
    const SOUND = 'random.levelup';
    taskManager.runTimeout(() => {
        game.summonFireworks(20);
        game.feedback.showFeedbackScreen({ title: TITLE, subtitle: SUBTITLE, sound: SOUND });
        game.player.dimension.spawnParticle('minecraft:totem_particle', game.player.location);
    }, 20);
    
    //初始化方塊統計
    game._structure.fullCheckInitial();
    
    await game.resetGame();
    game.timerManager.restart();
}
