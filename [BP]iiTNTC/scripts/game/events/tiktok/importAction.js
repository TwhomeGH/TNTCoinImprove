import { giftConfig } from "./MakeGiftEvent"; // 或 require('./giftEvents.json')，取決於環境

import { DEFAULT_GIFT, TIKTOK_GIFT } from "../../../lang/tiktokGifts";
import { taskManager } from "../../../core/TaskManager";




export function importAction(game, message={}) {
// 假設 player 已經有了


let eventManager = game.giftActionManager
// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.gift)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


eventManager.loadAllEventActions()


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}

console.log("所有禮物事件已經從 JSON 配置加載完成。");



eventManager = game.chatActionManager



// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.chat)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}


eventManager.loadAllEventActions()

console.log("所有聊天事件已經從 JSON 配置加載完成。");



eventManager = game.followActionManager



// 清空舊事件
eventManager.clearAllEventActions();

console.log(JSON.stringify(giftConfig,null,4))

// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.follow)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}


eventManager.loadAllEventActions()

console.log("所有追隨事件已經從 JSON 配置加載完成。");


eventManager = game.memberActionManager



// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.member)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}


eventManager.loadAllEventActions()

console.log("所有進入直播間事件已經從 JSON 配置加載完成。");

eventManager = game.likeActionManager



// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.like)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}


eventManager.loadAllEventActions()

console.log("所有點讚事件已經從 JSON 配置加載完成。");

eventManager = game.shareActionManager



// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.share)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}



console.log("所有分享事件已經從 JSON 配置加載完成。");


eventManager = game.rewardActionManager



// 清空舊事件
eventManager.clearAllEventActions();


// 遍歷 JSON 配置，塞入 EventActionManager
for (const [eventKey, actions] of Object.entries(giftConfig.reward)) {
  
  
  actions.forEach(action => {
    action.eventKey = eventKey; // 確保 action 裡有 eventKey
    eventManager.addActionToEvent(action);
  });
}


// 測試輸出
for (const [key, actions] of eventManager.getAllEvents()) {
  console.log(`EventKey: ${key}, Actions: ${actions.length}`);
  console.log(JSON.stringify(actions,null,4))
}


eventManager.loadAllEventActions()

console.log("所有Twitch小奇點事件已經從 JSON 配置加載完成。");



}