import { executeAction } from "../../actions/executeAction";
/**
 * Handles the comment event.
 * @param {TNTCoin} game the TNT Coin game instance.
 * @param {string} message the message sent by TikTokLiveMCBE
 */
export function onReward(game, message) {
    const { uniqueId, nickname, comment,rewardCost } = JSON.parse(message);
    const chatActions = game.rewardActionManager.getAllEvents();
    chatActions.forEach((actions, eventKey) => {
        if (eventKey === rewardCost) {
            actions.forEach(action => executeAction(game, action));
        }
    });
    game.player.sendMessage(`§7[§aReward§7]: §f${nickname} §7: §f${comment}`);
}
