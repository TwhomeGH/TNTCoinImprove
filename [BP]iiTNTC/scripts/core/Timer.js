export class Timer {
    player;
    actionBar;
    taskId;
    isRunning;
    duration;
    remainingTime;
    onEndCallbacks = [];
    /**
     * Creates a new timer for the given player.
     * @param {Player} player The player for whom the timer is created.
     * @param {number} duration The duration of the timer in seconds.
     * @param {ActionBar} actionBar The action bar instance to display the timer.
     */
    constructor(player, duration, actionBar) {
        this.player = player;
        this.actionBar = actionBar;
        this.setTimerDuration(duration);
        this.taskId = `${player.name}:timer:actionbar`;
        this.isRunning = false;
    }
    /**
     * Gets whether the timer is currently running.
     */
    get isTimerRunning() {
        return this.isRunning;
    }
    /**
     * Gets the remaining time on the timer.
     */
    get timeRemaining() {
        return this.remainingTime;
    }
    /**
     * Registers a callback to be called when the timer ends.
     * @param {TimerCallback} callback The callback function to be executed on timer end.
     */
    addOnEndCallback(callback) {
        this.onEndCallbacks.push(callback);
    }
    /**
     * Starts the timer.
     */
    start() {
        if (this.isRunning) {
            this.player.sendMessage('§cTimer is already running.');
            return;
        }
        ;
        this.isRunning = true;
        this.actionBar.addTask(this.taskId, async () => await this.task());
        this.player.playSound('random.orb');
    }
    /**
     * The main task that runs the timer.
     */
    async task() {
        if (this.remainingTime > 0) {
            this.remainingTime--;
        }
        else {
            this.stop();
            await this.executeCallbacks(this.onEndCallbacks);
        }
        return this.getFormattedTime();
    }
    /**
     * Executes the given callbacks.
     */
    async executeCallbacks(callbacks) {
        for (const callback of callbacks) {
            await Promise.resolve(callback());
        }
    }
    /**
     * Stops the timer.
     */
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        this.clearActionBar();
        this.reset();
        this.player.playSound('random.orb');
    }
    /**
     * Restarts the timer with the initial duration.
     */
    restart() {
        if (this.isRunning) {
            this.reset();
            this.player.playSound('random.orb');
        }
    }
    reset() {
        this.remainingTime = this.duration;
    }
    /**
     * Gets the duration of the timer.
     * @returns The duration of the timer.
     */
    getTimerDuration() {
        return this.duration - 1;
    }
    /**
     * Sets the duration of the timer.
     */
    setTimerDuration(duration) {
        if (this.isRunning)
            return;
        this.duration = duration + 1;
        this.remainingTime = this.duration;
    }
    /**
     * Gets the formatted time string for the action bar display.
     */
    getFormattedTime() {
        const timeColor = this.remainingTime <= 10 ? '§c' : '§a';
        return ['Time Left: ', timeColor, this.remainingTime];
    }
    /**
     * Clears the action bar display.
     */
    clearActionBar() {
        this.actionBar.removeTasks([this.taskId]);
    }
}
