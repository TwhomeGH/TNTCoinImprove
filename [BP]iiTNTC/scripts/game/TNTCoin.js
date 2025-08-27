import { TNTCoinStructure } from "./TNTCoinStructure";
import { Countdown } from "../core/Countdown";
import { taskManager } from "../core/TaskManager";
import { rotateCamera360 } from "./utilities/camera/rotate360";
import { floorVector3 } from "./utilities/math/floorVector";
import { Timer } from "../core/Timer";
import { event as eventHandlerRegistry } from "./events/tiktok/index";
import { PlayerFeedback } from "../core/PlayerFeedback";
import { WinManager } from "../core/WinManager";
import { onMaxWin } from "./events/tntcoin/onMaxWin";
import { onCountdownCancel } from "./events/tntcoin/onCountdownCancel";
import { ActionBar } from "../core/ActionBar";
import { INGAME_PLAYERS } from "./TNTCoinGui";
import { GiftGoal } from "../core/GiftGoal";
import { DynamicPropertiesManager } from "../core/DynamicPropertiesManager";
import { summonEntities } from "./utilities/entities/spawner";
import { onLose } from "./events/tntcoin/onLose";
import { onWin } from "./events/tntcoin/onWin";
import { EventActionManager } from "../core/EventActionManager";
import { batch } from "./utilities/batch";
/**
 * Represents a TNTCoin game instance.
 */
export class TNTCoin {
    _player;
    _propertiesManager;
    _structure;
    _feedback;
    _countdown;
    _timerManager;
    _winManager;
    _actionBar;
    _giftGoal;
    giftActionManager;
    followActionManager;
    shareActionManager;
    memberActionManager;
    likeActionManager;
    chatActionManager;
    rewardActionManager;
    _isPlayerInGame = false;
    _gameKey;
    _taskAutoSaveId;
    _taskCameraId;
    _taskFillCheckId;
    _useBarriers = false;
    _doesCameraRotate = true;
    _randomizeBlocks = false;
    _summonEntityFormSettings = {
        entityName: 'tnt_minecart',
        locationType: 'random',
        onTop: false,
        amount: 10,
        batchSize: 5,
        batchDelay: 5,
        playSound: {
            playSoundOnSummon: true,
            sound: 'kururin',
        }
    };
    /**
     * Creates a new TNTCoin game instance.
     * @param {Player} player The player to create the game for.
     */
    constructor(player) {
        this._gameKey = 'TNTCoinGameState';
        this._player = player;
        this._propertiesManager = new DynamicPropertiesManager(player);
        this._structure = new TNTCoinStructure(player);
        this._feedback = new PlayerFeedback(player);
        this._actionBar = new ActionBar(player);
        this._countdown = new Countdown(10, player);
        this._timerManager = new Timer(player, 180, this._actionBar);
        this._winManager = new WinManager(10, this._actionBar);
        this._giftGoal = new GiftGoal(player, this._actionBar);
        this.giftActionManager = new EventActionManager(player, 'GiftActions');
        this.followActionManager = new EventActionManager(player, 'FollowActions');
        this.shareActionManager = new EventActionManager(player, 'ShareActions');
        this.memberActionManager = new EventActionManager(player, 'MemberActions');
        this.likeActionManager = new EventActionManager(player, 'LikeActions');
        this.chatActionManager = new EventActionManager(player, 'ChatActions');
        this.rewardActionManager = new EventActionManager(player, 'RewardActions');
        this._taskAutoSaveId = `${player.name}:autosave`;
        this._taskFillCheckId = `${player.name}:fillcheck`;
        this._taskCameraId = `${player.name}:camera`;
        this._timerManager.addOnEndCallback(() => onLose(this));
        this._countdown.addOnEndCallback(() => onWin(this));
        this._countdown.addOnCancelCallback(() => onCountdownCancel(this));
    }
    get settings() {
        return {
            doesCameraRotate: this._doesCameraRotate,
            useBarriers: this._useBarriers,
            randomizeBlocks: this._randomizeBlocks,
            wins: this._winManager.getCurrentWins(),
            maxWins: this._winManager.getMaxWins(),
            timerDuration: this.timerManager.getTimerDuration(),
            defaultCountdownTime: this._countdown.defaultCountdownTime,
            countdownTickInterval: this._countdown.tickInterval,
            fillSettings: this._structure.fillSettings,
            giftGoalSettings: this._giftGoal.settings,
            summonEntitySettings: this._summonEntityFormSettings,
        };
    }
    set settings(settings) {
        this._doesCameraRotate = settings.doesCameraRotate;
        this._useBarriers = settings.useBarriers;
        this._randomizeBlocks = settings.randomizeBlocks;
        this._winManager.setWins(settings.wins);
        this._winManager.setMaxWins(settings.maxWins);
        this._timerManager.setTimerDuration(settings.timerDuration);
        this._countdown.defaultCountdownTime = settings.defaultCountdownTime;
        this._countdown.tickInterval = settings.countdownTickInterval;
        this._structure.fillSettings = settings.fillSettings;
        this._giftGoal.settings = settings.giftGoalSettings;
        this._summonEntityFormSettings = settings.summonEntitySettings;
    }
    get summonEntityFormSettings() {
        return this._summonEntityFormSettings;
    }
    set summonEntityFormSettings(settings) {
        this._summonEntityFormSettings = {
            ...this._summonEntityFormSettings,
            ...settings,
        };
    }
    get player() {
        return this._player;
    }
    get isPlayerInGame() {
        return this._isPlayerInGame;
    }
    set isPlayerInGame(value) {
        this._isPlayerInGame = value;
    }
    get structure() {
        return this._structure;
    }
    get feedback() {
        return this._feedback;
    }
    get countdown() {
        return this._countdown;
    }
    get winManager() {
        return this._winManager;
    }
    get actionbar() {
        return this._actionBar;
    }
    get giftGoal() {
        return this._giftGoal;
    }
    get timerManager() {
        return this._timerManager;
    }
    /**
     * Start the game
     */

    async changeGame(){
        await this._structure.fillStop()
        await this._structure.clearProtedtedStructure();
        await this._structure.generateProtectedStructure();
    }
    async startGame() {
        try {
            await this._structure.generateProtectedStructure();
            
            this._structure.fullCheckInitial(); // ✅ 初始化已填充方塊

            if (this.settings.useBarriers)
                await this._structure.generateBarriers();
            this._player.setSpawnPoint({
                ...this._structure.structureCenter,
                dimension: this._player.dimension
            });
            this.teleportPlayer();
            this.checkGameStatus();
            this._actionBar.start();
            this.autoSaveGameState();
            this._feedback.playSound('random.anvil_use');
            this._feedback.playSound('random.levelup');
        }
        catch (error) {
            this._feedback.error(`Failed to start game. ${error.message}`, { sound: 'item.shield.block' });
            this.quitGame();
            throw error;
        }
    }
    autoSaveGameState() {
        const gameState = {
            isPlayerInGame: this._isPlayerInGame,
            gameSettings: this.settings,
            structureProperties: this._structure.structureProperties,
        };
        this._propertiesManager.setProperty(this._gameKey, JSON.stringify(gameState));
        taskManager.addTimeout(this._taskAutoSaveId, () => this.autoSaveGameState(), 20);
    }
    /**
     * Load the game state from the player's dynamic properties.
     */
    loadGameState() {
        const properties = this._propertiesManager.getProperty(this._gameKey);
        const gameState = JSON.parse(properties);
        this._isPlayerInGame = gameState.isPlayerInGame;
        this.settings = gameState.gameSettings;
        this._structure.structureProperties = JSON.stringify(gameState.structureProperties);
    }
    /**
     * Load the game
     * @returns {Promise<void>} a promise that resolves when the game has been successfully loaded.
     */
    async loadGame() {
        try {
            this.loadGameState();
            await this.startGame();
            console.warn(`Game loaded for player ${this._player.name}`);
        }
        catch (error) {
            console.error(`Error loading game: ${error}`);
        }
    }
    /**
     * Quit the game
     * @returns {Promise<void>} a promise that resolves when the game has been successfully quit.
     */
    async quitGame() {
        if (this._countdown.isCountingDown) {
            this._feedback.warning('Cannot quit the game while countdown is active.', { sound: 'item.shield.block' });
            return;
        }
        try {
            await this.cleanGameSession();
            this._propertiesManager.removeProperty(this._gameKey);
            this._propertiesManager.removeProperty(this._structure.structureKey);
            this.isPlayerInGame = false;
            INGAME_PLAYERS.delete(this._player.name);
        }
        catch (error) {
            console.error(`Error quitting game: ${error}`);
        }
    }
    /**
     * Resets the game by clearing all filled blocks and camera rotation.
     * @returns {Promise<void>} A promise that resolves when the game is restarted.
     */
    async resetGame() {
        this.cameraClear();
        await this._structure.clearFilledBlocks();
    }
    /**
    * Cleans up the game session by stopping all activities and clearing blocks.
    * @returns {Promise<void>} A promise that resolves when the cleanup is complete.
    */
    async cleanGameSession() {
        this.clearGameTasks();
        this._countdown.reset();
        this._structure.fillStop();
        this._actionBar.stop();
        this._timerManager.stop();
        this._winManager.clearActionbar();
        this._giftGoal.clearActionbar();
        this.cameraClear();
        await this._structure.clearFilledBlocks();
        await this._structure.clearProtedtedStructure();
    }
    /**
     * Rotates the player's camera 360 degrees around the structure.
     */
    cameraRotate360() {
        if (!this._doesCameraRotate)
            return;
        const tickInterval = 5;
        rotateCamera360(this._player, this._taskCameraId, floorVector3(this._structure.structureCenter), this._structure.structureWidth, this._structure.structureHeight + 12, tickInterval);
    }
    /**
     * Returns the player to their normal perspective
     */
    cameraClear() {
        taskManager.clearTask(this._taskCameraId);
        this._player.camera.clear();
    }
    /**
    * teleport the player to the center of structure
    * @param {number} height The height to teleport the player to. Default is 1.
    */
    teleportPlayer(height = 1) {
        const TELEPORT_SOUND = 'mob.shulker.teleport';
        const { x, y, z } = this._structure.structureCenter;
        const location = { x, y: y + height, z };
        this._player.teleport(location);
        this._feedback.playSound(TELEPORT_SOUND);
    }
    summonEntities(options) {
        summonEntities(this, options);
    }
    summonFireworks(amount) {
        const locations = Array.from({ length: amount }, () => this._structure.randomLocation(2));
        const particle = 'tntcoin:firework_1';
        batch(locations, 3, (location) => {
            this._player.dimension.spawnParticle(particle, location);
            this.player.playSound('firework.large_blast');
            this.player.playSound('firework.twinkle');
        }, {
            delayInTicks: 10
        });
    }
    /**
     * summons TNT at random locations in the structure
     */
    summonTNT() {
        this.summonEntities({
            entityName: 'tnt_minecart',
            locationType: 'random',
            onTop: true
        });
    }
    clearGameTasks() {
        taskManager.clearTasks([
            this._taskFillCheckId,
            this._taskCameraId,
            this._taskAutoSaveId
        ]);
    }
    /**
     * Handles script events.
     * @param {ScriptEventCommandMessageAfterEvent} event - The event and message to handle
     */
    handleScriptEvents(event) {
        if (!event.id.startsWith('tntcoin'))
            return;
        const eventType = event.id.split(':')[1];
        if (!eventHandlerRegistry.isEventEnabled(eventType))
            return;
        const message = event.message;
        const handler = eventHandlerRegistry.getHandler(eventType);
        if (handler)
            handler(this, message);
    }
    /**
     * Checks the game status to determine if the structure is filled.
     */
    checkGameStatus() {
        taskManager.addInterval(this._taskFillCheckId, () => {
            try {
                this.handleGameProgress(this._structure.isStructureFilled());
            }
            catch (error) {
                console.error(`Error checking game status: ${error.message}`);
                this.clearGameTasks();
            }
        }, 20);
    }
    /**
     * Handles the progress of the game, including managing countdowns and checking for wins.
     * @param {boolean} isStructureFilled - Whether the structure is fully filled.
     */
    handleGameProgress(isStructureFilled) {
        try {
            if (this._winManager.hasReachedMaxWins()) {
                onMaxWin(this);
            }
            else {
                this.handleCountdown(isStructureFilled);
            }
        }
        catch (error) {
            console.error(`Error handling game progress: ${error.message}`);
            throw error;
        }
    }
    /**
     * Manages the countdown based on whether the structure is filled or not.
     * @param {boolean} isStructureFilled - Whether the structure is fully filled.
     */
    handleCountdown(isStructureFilled) {
        if (!isStructureFilled && this._countdown.isCountingDown) {
            this.cameraClear();
            this._countdown.pause();
            this._countdown.reset();
        }
        else if (isStructureFilled && !this._countdown.isCountingDown) {
            this.cameraRotate360();
            this._countdown.start();
        }
    }
}
