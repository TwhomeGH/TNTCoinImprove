import { DEFAULT_GIFT, TIKTOK_GIFT } from '../lang/tiktokGifts';
export class GiftGoal {
    _player;
    _actionBar;
    _gift = null;
    _giftName = '';
    _currentCount = 0;
    _maxCount = 100;
    _isActive = false;
    _isEnabled = false;
    _isGoalAnnounced = false;
    constructor(player, actionBar) {
        this._player = player;
        this._actionBar = actionBar;
    }
    get settings() {
        return {
            giftName: this._giftName,
            maxCount: this._maxCount,
            currentCount: this._currentCount,
            isActive: this._isActive,
            isEnabled: this._isEnabled
        };
    }
    set settings(data) {
        if (data.giftName)
            this.setGift(data.giftName);
        if (data.maxCount)
            this.setMaxCount(data.maxCount);
        if (data.currentCount)
            this.setCurrentCount(data.currentCount);
        if (data.isActive)
            this._isActive = data.isActive;
        if (data.isEnabled)
            this.setEnabled(data.isEnabled);
    }
    /**
     * Increases the current count of gifts.
     * @param count - The number of gifts to add.
     */
    addGifts(count) {
        if (!this._isActive || !this._gift)
            return;
        this._currentCount += count;
        if (this._currentCount > this._maxCount) {
            this._currentCount = this._maxCount;
        }
        this.updateActionBar();
    }
    /**
     * Resets the current gift count to zero.
     */
    reset() {
        this._currentCount = 0;
        this._isGoalAnnounced = false;
        this.updateActionBar();
    }
    /**
     * Toggles the gift goal display on or off.
     * @param isEnabled - True to enable, false to disable.
     */
    setEnabled(isEnabled) {
        this._isEnabled = isEnabled;
        if (this._isEnabled) {
            this.updateActionBar();
        }
        else {
            this._actionBar.removeTasks(['giftGoal']);
        }
    }
    /**
     * Clears the action bar display for the gift goal.
     */
    clearActionbar() {
        this._isActive = false;
        this._actionBar.removeTasks(['giftGoal']);
    }
    /**
     * Checks if the gift goal display is enabled.
     * @returns {boolean} - True if enabled, false if disabled.
     */
    isEnabled() {
        return this._isEnabled;
    }
    /**
     * Updates the action bar display.
     */
    updateActionBar() {
        if (!this._gift || !this._isEnabled)
            return;
        if (this._currentCount === undefined) {
            this._currentCount = 0;
        }
        this._isActive = this._isEnabled;
        if (this.isGoalReached()) {
            if (!this._isGoalAnnounced) {
                this._player.sendMessage(`§aYou have reached the goal of §d${this._giftName}§a!`);
                this._player.playSound('random.levelup');
                this._isGoalAnnounced = true;
            }
        }
        else {
            this._isGoalAnnounced = false;
        }
        this._actionBar.addTask('giftGoal', () => {
            const progress = [
                this._gift.emoji,
                ' ',
                this._giftName,
                ': ',
                this.isGoalReached() ? '§a§l' : '§c',
                this._currentCount,
                '§r/',
                '§d',
                this._maxCount,
                '§f'
            ];
            return progress;
        });
    }
    /**
     * Checks if the goal has been reached.
     * @returns {boolean} - True if the goal is reached, otherwise false.
     */
    isGoalReached() {
        return this._currentCount >= this._maxCount;
    }
    /**
     * Returns whether the gift goal is active.
     */
    isActive() {
        return this._isActive;
    }
    /**
     * Gets the current count of gifts.
     * @returns {number} - The current count of gifts.
     */
    getCurrentCount() {
        return this._currentCount;
    }
    /**
     * Gets the maximum count of gifts for the goal.
     * @returns {number} - The maximum count of gifts for the goal.
     */
    getMaxCount() {
        return this._maxCount;
    }
    /**
     * Gets the emoji or icon of the gift.
     * @returns {string} - The emoji or icon of the gift.
     */
    getGiftEmoji() {
        return this._gift ? this._gift.emoji : DEFAULT_GIFT;
    }
    /**
     * Gets the name of the gift.
     * @returns {string} - The name of the gift.
     */
    getGiftName() {
        return this._giftName;
    }
    /**
     * Gets the ID of the gift.
     * @returns {number | null} - The ID of the gift.
     */
    getGiftId() {
        return this._gift ? this._gift.id : null;
    }
    /**
     * Sets the current count of gifts.
     * @param count - The current count of gifts.
     */
    setCurrentCount(count) {
        this._currentCount = count;
        this.updateActionBar();
    }
    /**
     * Sets the maximum count of gifts for the goal.
     * @param maxCount - The maximum count of gifts.
     */
    setMaxCount(maxCount) {
        this._maxCount = maxCount;
        this.updateActionBar();
    }
    /**
     * Sets the gift for the goal and resets the current count.
     * @param giftName - The name of the gift.
     */
    setGift(giftName) {
        const gift = TIKTOK_GIFT[giftName];
        if (!gift || !gift.emoji) {
            throw new Error('Selected gift does not have a valid emoji.');
        }
        this._gift = gift;
        this._giftName = giftName;
        this.reset();
        this.updateActionBar();
        this._player.playSound('random.orb');
    }
}
