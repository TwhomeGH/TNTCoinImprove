import { DEFAULT_GIFT, TIKTOK_GIFT } from "../../../lang/tiktokGifts";
import { taskManager } from "../../../core/TaskManager";

//import { executeAction } from "../../actions/executeAction";


/**
 * Handles the follow event.
 * @param {TNTCoin} game the TNT Coin game instance.
 * @param {string} message the message sent by TikTokLiveMCBE
 */
export function onAction(game, message={}) {
     game.player.sendMessage(typeof message)
    
    if (typeof message === 'string') {
        try{
        message = JSON.parse(message);
        }catch(error){
            message={}
        }
    }
     const defaultMessage = {
        rdelay: 60,
        adelay: 60,
        debug:false
    };

    message = Object.assign(defaultMessage, message);
    
    let { rdelay, adelay,debug } = message;
    const giftEvents = game.giftActionManager.getAllEvents();
    
    
    
    
    //let rdelay=60
	giftEvents.forEach((actions, eventKey) => {
            let giftName = '';
            let giftEmoji = '';
            let giftId=0;
            actions.forEach((action, index) => {
                giftId= action.giftId
                giftName = action.giftName;
                giftEmoji = action.giftEmoji;
            });
           
           let timeoutID=game.player.name + ":delay:" + giftId
           
           if(debug)game.player.sendMessage("Name:"+timeoutID);
           
           
           let cStep= ()=>{
           
           game.player.runCommand("scoreboard objectives remove display")
           game.player.runCommand("scoreboard objectives add display dummy Display")
           game.player.runCommand("scoreboard objectives setdisplay sidebar display")
        
           let matchedGift = Object.values(TIKTOK_GIFT).find(gift => gift.id === giftId) || TIKTOK_GIFT[giftName];
           
           let DisplayGift=`${giftId}-${giftEmoji}:${giftName} ${matchedGift.coins}`
           game.player.runCommand(`scoreboard players add "${DisplayGift.split("-")[1]}" display 1 `)
           
           if(debug)game.player.sendMessage(DisplayGift) ;
           
           let actions2 = game.giftActionManager.getActionsForEvent(matchedGift.id.toString())  || game.giftActionManager.getActionsForEvent(giftName)
        
           if (actions2 && actions2.length > 0) {
               let ActionSort=0
               actions2.forEach((action3) => {
                let DisplayAction="運行類型："+action3.actionType
                game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                if(debug)game.player.sendMessage(DisplayAction) ;
                
                ActionSort--
            });
           }
        
          }
        taskManager.addTimeout(timeoutID, () => cStep(), rdelay);
        rdelay+=adelay
    });
    
    
    
    
    
    if(debug)game.player.sendMessage("[點贊數]累計事件：");
    
    const likeActions = game.likeActionManager.getAllEvents();
    
    
    if (likeActions.size > 0) {
        likeActions.forEach((actions, likeKey) => {
            //const likeThreshold = parseInt(likeKey);


            let timeoutID=game.player.name + ":delay:" + likeKey
            if(debug)game.player.sendMessage("Name:"+timeoutID);
            
            let cStep2=()=>{
    
            game.player.runCommand("scoreboard objectives remove display")
            game.player.runCommand("scoreboard objectives add display dummy Display")
            game.player.runCommand("scoreboard objectives setdisplay sidebar display")
          
            
            
            let Displaylike=`點贊數30秒內累計：${likeKey}`
            game.player.runCommand(`scoreboard players add "${Displaylike.split("：")[0]}" display ${likeKey} `)
            
            if(debug)game.player.sendMessage(Displaylike);
            
            let ActionSort=0
            actions.forEach(action => {
                let DisplayAction="運行類型："+action.actionType
                if(debug)game.player.sendMessage(DisplayAction);
                game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                });
                ActionSort--
            }
            
            taskManager.addTimeout(timeoutID, () => cStep2(), rdelay);
            rdelay+=adelay
        });

    }
    
    
    
    //聊天事件
    const chatActions = game.chatActionManager.getAllEvents();
    
    
    if (chatActions.size > 0) {
        chatActions.forEach((actions, commentKey) => {

            let timeoutID=game.player.name + ":delay:" + commentKey
            if(debug)game.player.sendMessage("Name:"+timeoutID);
            
            let cStep2=()=>{
    
            game.player.runCommand("scoreboard objectives remove display")
            game.player.runCommand("scoreboard objectives add display dummy Display")
            game.player.runCommand("scoreboard objectives setdisplay sidebar display")
          
            
            
            let DisplayComment=`直播聊天室事件：${commentKey}`
            game.player.runCommand(`scoreboard players add "${DisplayComment}" display 1 `)
            
            if(debug)game.player.sendMessage(DisplayComment);
            
            let ActionSort=0
            actions.forEach(action => {
                let DisplayAction="運行類型："+action.actionType
                if(debug)game.player.sendMessage(DisplayAction);
                game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                });
                ActionSort--
            }
            
            taskManager.addTimeout(timeoutID, () => cStep2(), rdelay);
            rdelay+=adelay
        });

    }
    
    //追隨事件

    const followActions = game.followActionManager.getAllEvents().get("follow");
    
    if (followActions.length > 0) {
        
    let timeoutID=game.player.name + ":delay:" + "follow"
    if(debug)game.player.sendMessage("Name:"+timeoutID);
            
    let cStep2=()=>{
    
            game.player.runCommand("scoreboard objectives remove display")
            game.player.runCommand("scoreboard objectives add display dummy Display")
            game.player.runCommand("scoreboard objectives setdisplay sidebar display")
          
            
            
            let DisplayComment=`直播間追隨事件`
            game.player.runCommand(`scoreboard players add "${DisplayComment}" display 1 `)
            
            if(debug)game.player.sendMessage(DisplayComment);
            
            let ActionSort=0
            
            if (followActions.length > 0) {
                for (const action of followActions){
                    let DisplayAction="運行類型："+action.actionType
                
                    if(debug)game.player.sendMessage(DisplayAction);
                    game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                
                    ActionSort--
                }
            }
        }
        
    taskManager.addTimeout(timeoutID, () => cStep2(), rdelay);
    rdelay+=adelay
    }
    
    
    //加入直播間事件
    const joinActions = game.memberActionManager.getAllEvents().get("member");
    
    if (joinActions.length > 0) {
    
    let timeoutID=game.player.name + ":delay:" + "join"
    if(debug)game.player.sendMessage("Name:"+timeoutID);
            
    let cStep2=()=>{
    
            game.player.runCommand("scoreboard objectives remove display")
            game.player.runCommand("scoreboard objectives add display dummy Display")
            game.player.runCommand("scoreboard objectives setdisplay sidebar display")
          
            
            
            let DisplayJoin=`加入直播間事件`
            game.player.runCommand(`scoreboard players add "${DisplayJoin}" display 1 `)
            
            if(debug)game.player.sendMessage(DisplayJoin);
            
            let ActionSort=0
            
            if (joinActions.length > 0) {
                for (const action of joinActions){
                    let DisplayAction="運行類型："+action.actionType
                
                    if(debug)game.player.sendMessage(DisplayAction);
                    game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                
                    ActionSort--
                }
            }
        }
        
    taskManager.addTimeout(timeoutID, () => cStep2(), rdelay);
    rdelay+=adelay
    }
    
    //分享直播間
    const shareActions = game.shareActionManager.getAllEvents().get("share");
    
    if (shareActions.length > 0) {
        
    let timeoutID=game.player.name + ":delay:" + "share"
    if(debug)game.player.sendMessage("Name:"+timeoutID);
            
    let cStep2=()=>{
    
            game.player.runCommand("scoreboard objectives remove display")
            game.player.runCommand("scoreboard objectives add display dummy Display")
            game.player.runCommand("scoreboard objectives setdisplay sidebar display")
          
            
            
            let DisplayJoin=`分享直播間事件`
            game.player.runCommand(`scoreboard players add "${DisplayJoin}" display 1 `)
            
            if(debug)game.player.sendMessage(DisplayJoin);
            
            let ActionSort=0
            
            if (shareActions.length > 0) {
                for (const action of shareActions){
                    let DisplayAction="運行類型："+action.actionType
                
                    if(debug)game.player.sendMessage(DisplayAction);
                    game.player.runCommand(`scoreboard players add "${DisplayAction}" display ${ActionSort} `)
                
                    ActionSort--
                }
            }
        }
        
    taskManager.addTimeout(timeoutID, () => cStep2(), rdelay);
    rdelay+=adelay
    }
    
    
    
    
    let timeoutID=game.player.name + ":delay:clearDisplay" 
    
    rdelay+=120
    
    taskManager.addTimeout(timeoutID, () => {
        game.player.runCommand("scoreboard objectives remove display")
    }, rdelay);
    
    
	//if (actions.length > 0) {
        //for (const action of actions){
            //executeAction(game, action);
		//}
    //}
    
    game.player.sendMessage(`§7[§a事件檢查§7]: §b行動事件樹§f\n${new Date().toLocaleString()}`);
    
    
    
    //world.events.tick.unsubscribe(func); 
}
