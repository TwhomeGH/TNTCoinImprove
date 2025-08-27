import { executeAction } from "../../actions/executeAction";
/**
 * Handles the comment event.
 * @param {TNTCoin} game the TNT Coin game instance.
 * @param {string} message the message sent by TikTokLiveMCBE
 */
export function onReward(game, message) {
    const { uniqueId, nickname, comment,rewardCost,type } = JSON.parse(message);
    const chatActions = game.rewardActionManager.getAllEvents();
    
	chatActions.forEach((actions, eventKey) => {
		//console.log(JSON.stringify(actions,null,4))
		console.log(JSON.stringify(eventKey,null,4))
        
		if (eventKey === rewardCost) {
            actions.forEach(action => {
				 if (action.type == type) {
					executeAction(game, action)
				 }
				});
        }
		
    });
    game.player.sendMessage(`§7[§aReward§7]: §f${nickname} §7: §f${comment}`);
}
