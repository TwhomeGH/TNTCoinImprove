export class WinManager {
    _reachMaxWin=false;
    _currentWins = 0;
    _maxWins;
    _actionBar;
    _taskId = 'wins:actionbar';
    constructor(maxWins, actionBar) {
        this._maxWins = maxWins;
        this._actionBar = actionBar;
        this.setupActionBar();
    }
    /**
     * Sets up the ActionBar to display the current and maximum wins.
     */

    get Hasreach(){
        return this._reachMaxWin;
    }
    set Hasreach(bool){
        this._reachMaxWin = bool;
    }
              
    setupActionBar() {
        this._actionBar.addTask(this._taskId, () => {
            const currentWins = this._currentWins;
            const maxWins = this._maxWins;
            let countColor = '§a';
            if (currentWins < 0) {
                countColor = '§c';
            }
            else if (currentWins >= maxWins) {
                countColor = '§c';
            }
            
            let TipReach=""
            if(this._reachMaxWin){
                TipReach="§a[Completed]§f"
            }
            return [TipReach,'Wins: ', countColor, currentWins, '§f/', '§a', maxWins];
        });
    }
    /**
     * Increments the win count by 1.
     */
    incrementWin() {
        this._currentWins++;
        this._actionBar.updateDisplay();
    }
    /**
     * Decrements the win count by 1.
     */
    decrementWin() {
        this._currentWins--;
        this._actionBar.updateDisplay();
    }
    /**
     * Resets the win count to 0.
     */
    resetWins() {
        this._currentWins = 0;
        this._actionBar.updateDisplay();
    }
    /**
     * Checks if the player has reached the max wins.
     * @returns {boolean} `true` if the player has reached the max wins, otherwise `false`.
     */
    hasReachedMaxWins() {
        return this._currentWins >= this._maxWins;
    }
    /**
     * Gets the current win count.
     * @returns {number} The current win count.
     */
    getCurrentWins() {
        return this._currentWins;
    }
    /**
     * Gets the max wins required to trigger a win.
     * @returns {number} The max wins.
     */
    getMaxWins() {
        return this._maxWins;
    }
    /**
     * Sets the max wins required to trigger a win.
     * @param {number} maxWins The new max wins.
     * @returns {number} The new max wins.
     */
    setMaxWins(maxWins) {
        this._maxWins = maxWins;
        this._actionBar.updateDisplay();
        return this._maxWins;
    }
    /**
     * Sets the current win count.
     * @param {number} wins The new win count.
     * @returns {number} The new win count.
     */
    setWins(wins) {
        this._currentWins = wins;
        this._actionBar.updateDisplay();
        return this._currentWins;
    }
    clearActionbar() {
        this._actionBar.removeTasks([this._taskId]);
    }
}
