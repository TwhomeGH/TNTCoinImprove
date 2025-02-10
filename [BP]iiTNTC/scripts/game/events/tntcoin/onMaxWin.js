/**
 * Handles the event when the player reaches the maximum number of wins.
 * @param {TNTCoin} game - The current instance of the TNTCoin game.
 * @returns {Promise<void>} - A promise that resolves when the player reaches the maximum number of wins.
 */
export async function onMaxWin(game) {
    const isMaxWin = game.winManager.hasReachedMaxWins();
    if (!isMaxWin)
        return;
    const TITLE = `§a${game.winManager.getCurrentWins()}§f/§a${game.winManager.getMaxWins()}§r\n§aCongratulations!§r`;
    const SUBTITLE = '§eYou have won the game!§r';
    const MESSAGE = '§eYou have reached the maximum number of wins!§r';
    const SOUND = 'random.levelup';
    game.player.sendMessage(MESSAGE);
    game.feedback.showFeedbackScreen({ title: TITLE, subtitle: SUBTITLE, sound: SOUND });
    game.summonFireworks(20);
    await game.resetGame();
    game.winManager.resetWins();
    game.timerManager.stop();
}
