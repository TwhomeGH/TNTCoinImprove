import { PlayerFeedback } from "./PlayerFeedback";
import { taskManager } from "./TaskManager";
export class Countdown {
    _player;
    _feedback;
    _defaultCountdownTime;
    _countdownTime;
    _timeoutId;
    _isCountingDown = false;
    _tickInterval = 20;
    _onEndCallbacks = [];
    _onCancelCallbacks = [];
    constructor(defaultCountdown, player) {
        this._defaultCountdownTime = defaultCountdown;
        this._countdownTime = defaultCountdown;
        this._player = player;
        this._feedback = new PlayerFeedback(player);
    }
    get isCountingDown() {
        return this._isCountingDown;
    }
    get defaultCountdownTime() {
        return this._defaultCountdownTime;
    }
    set defaultCountdownTime(value) {
        this._defaultCountdownTime = value;
        this._countdownTime = value;
    }
    get tickInterval() {
        return this._tickInterval;
    }
    set tickInterval(value) {
        this._tickInterval = value;
    }
    /**
     * Registers a callback to be executed when the countdown ends.
     * @param callback The callback function.
     */
    addOnEndCallback(callback) {
        this._onEndCallbacks.push(callback);
    }
    /**
     * Registers a callback to be executed when the countdown is canceled.
     * @param callback The callback function.
     */
    addOnCancelCallback(callback) {
        this._onCancelCallbacks.push(callback);
    }
    /**
     * Starts the countdown.
     */
    start() {
        if (this._isCountingDown)
            return;
        this._isCountingDown = true;
        this.countdownStep();
    }
    /**
     * The countdown step.
     */
    async countdownStep() {
        if (!this._isCountingDown) {
            this.reset();
            await this.executeCallbacks(this._onCancelCallbacks);
            return;
        }
        this.displayCountdown();
        if (this._countdownTime === 0) {
            this.reset();
            await this.executeCallbacks(this._onEndCallbacks);
            return;
        }
        this._countdownTime--;
        this._timeoutId = `${this._player.name}:countdown`;
        taskManager.addTimeout(this._timeoutId, () => this.countdownStep(), this._tickInterval);
    }
    /**
     * Pauses the countdown.
     */
    pause() {
        this._isCountingDown = false;
        if (this._timeoutId) {
            taskManager.clearTask(this._timeoutId);
            this._timeoutId = undefined;
        }
        this.executeCallbacks(this._onCancelCallbacks);
    }
    /**
     * Resets the countdown.
     */
    reset() {
        this._isCountingDown = false;
        this._countdownTime = this._defaultCountdownTime;
        if (this._timeoutId) {
            taskManager.clearTask(this._timeoutId);
            this._timeoutId = undefined;
        }
    }
    /**
     * Executes the registered callbacks.
     * @param callbacks Array of callbacks to execute.
     */
    async executeCallbacks(callbacks) {
        for (const callback of callbacks) {
            await Promise.resolve(callback());
        }
    }
    /**
    * Get the color of the countdown based on the time remaining.
    * @param {number} countdown the time remaining.
    * @returns {string} the color code for the countdown.
    */
    getCountdownColor(countdown) {
        switch (true) {
            case countdown >= 8:
                return '§a';
            case countdown >= 4:
                return '§6';
            case countdown >= 1:
                return '§c';
            case countdown <= 0:
                return '§4';
            default:
                return '§f';
        }
    }
    /**
    * Display countdown on the player's screen.
    */
    displayCountdown() {
        const textColor = this._isCountingDown ? this.getCountdownColor(this._countdownTime) : '§4';
        this._feedback.setTitle(`§l${textColor}${this._countdownTime}`);
        this._feedback.setSubtitle('countdown');
        this._feedback.playSound(this._countdownTime >= 1 ? "respawn_anchor.charge" : "block.bell.hit");
    }
}
