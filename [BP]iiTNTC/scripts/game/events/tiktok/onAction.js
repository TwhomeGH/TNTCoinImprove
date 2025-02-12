import { DEFAULT_GIFT, TIKTOK_GIFT } from "../../../lang/tiktokGifts";

//import { executeAction } from "../../actions/executeAction";
/**
 * Handles the follow event.
 * @param {TNTCoin} game the TNT Coin game instance.
 * @param {string} message the message sent by TikTokLiveMCBE
 */
export function onAction(game, message) {
    const { nickname, uniqueId,sts } = JSON.parse(message);
    const giftEvents = game.giftActionManager.getAllEvents();
    
	
	giftEvents.forEach((actions, eventKey) => {
            let giftName = '';
            let giftEmoji = '';
            let giftId=0;
            actions.forEach((action, index) => {
                giftId= action.giftId
                giftName = action.giftName;
                giftEmoji = action.giftEmoji;
            });
           let matchedGift = Object.values(TIKTOK_GIFT).find(gift => gift.id === giftId) || TIKTOK_GIFT[giftName];
           game.player.sendMessage(`${giftId}-${giftName}:${giftEmoji} ${matchedGift.coins}`) 
           
           let actions2 = game.giftActionManager.getActionsForEvent(matchedGift.id.toString())  || game.giftActionManager.getActionsForEvent(giftName)
        
           if (actions2 && actions2.length > 0) {
               actions2.forEach((action3) => game.player.sendMessage("運行類型："+action3.actionType) );
           }
           
        
    });
	//if (actions.length > 0) {
        //for (const action of actions){
            //executeAction(game, action);
		//}
    //}
    game.player.sendMessage(`§7[§a事件檢查§7]: §b行動事件樹§f\n${new Date().toLocaleString()}`);
}
