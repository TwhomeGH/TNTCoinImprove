     
import simplifiedActions from './giftEvents.js'; // 簡化定義
import { actionTypeMap } from './tranAction.js'; // ActionType轉譯規則
import { keyExtractors } from './keyExtra.js'; // 事件轉譯規則





function translateActions(actions) {
  const result = {};
  
  for (const action of actions) {
    
    let keyData=null
    for (const extractor of Object.values(keyExtractors)) {
            keyData = extractor(action);
            if (keyData) break;
        }
        if (!keyData) continue; // 沒找到 key 的事件就跳過

    const { key, giftId, giftEmoji, giftName } = keyData;
        

    const typeConfig = actionTypeMap[action.actionType];
    if (!typeConfig) throw new Error("Unknown actionType: " + action.actionType);

     // 每個 action 的完整轉譯結果
    const tranAction = {
      ...keyData,
      actionType: action.actionType,
      [typeConfig.optionsKey]: typeConfig.mapping(action)
    };

    if (!result[key]) {
    result[key] = []; // 初始化為空陣列
    }

    // 用 key 存進 result
    result[key].push(tranAction)
    }
    return result
    
}

const fullActionsRaw = translateActions(simplifiedActions);


const categoryMap = {
  gift: (action) => !!action.giftId,
  follow: (action) => action.eventKey === "follow",
  member: (action) => action.eventKey === "member",
  share: (action) => action.eventKey === "share",
  like: (action) => !!action.likeCount,
  reward: (action) => !!action.reward,
  chat: (action) => !!action.eventKey ,
  system: (action) => !!action.systemEvent
};

const fullActions = {};

for (const [key, actions] of Object.entries(fullActionsRaw)) {
  actions.forEach(action => {
    for (const [category, matcher] of Object.entries(categoryMap)) {
      if (matcher(action)) {
        if (!fullActions[category]) fullActions[category] = {};
        if (!fullActions[category][key]) fullActions[category][key] = [];
        fullActions[category][key].push(action);
        break;
      }
    }
  });
}

console.log("tranGift",JSON.stringify(fullActions,null,4))
// 直接導出完整 JSON
export const giftConfig = fullActions;