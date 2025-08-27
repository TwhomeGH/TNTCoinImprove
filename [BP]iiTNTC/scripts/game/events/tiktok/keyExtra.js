import { DEFAULT_GIFT, TIKTOK_GIFT } from "../../../lang/tiktokGifts"; // 對照表


const normalizedGiftMap = {};
for (const name in TIKTOK_GIFT) {
    const normalized = name.replace(/\s+/g, '').toLowerCase(); // 去空格並小寫
    normalizedGiftMap[normalized] = { 
      ...TIKTOK_GIFT[name],
      giftName:name
      };
}


function getGiftInfo(inputName) {
    const normalizedInput = inputName.replace(/\s+/g, '').toLowerCase();
    return normalizedGiftMap[normalizedInput];
}



export const keyExtractors = {
    gift: (action) => {
        if (!action.giftName) return null;
        const giftInfo = getGiftInfo(action.giftName);
        if (!giftInfo) return null;
        return {
            key: giftInfo.id,
            giftId: giftInfo.id,
            giftEmoji: giftInfo.emoji,
            giftName: giftInfo.giftName
        };
    },
    chat: (action) => {
        if (action.text || action.chat) {
            return { 
                key: action.text ?? "666",
                eventKey: action.text ?? "666"
            };
        }
        return null;
    },
    follow: (action) => {
        if (action.follow === true || action.follow) {
            return { 
                key: "follow",
                eventKey:"follow"
            };
        }
        return null;
    },
    like: (action) => {
        if (action.like) {
            return { 
                key: action.like.toString() ?? "50",
                eventKey: action.like.toString() ?? "50",
                likeCount: action.like ?? "50"
            };
        }
        return null;
    },
    member: (action) => {
        if (action.member === true || action.member) {
            return { 
                key: "member",
                eventKey: "member"
            };
        }
        return null;
    },
       share: (action) => {
        if (action.share === true || action.share) {
            return { 
                key: "share",
                eventKey: "share"
            };
        }
        return null;
    },
    reward: (action) => {
        if (action.reward) {
            return { 
                key:action.reward,
                eventKey: action.reward,
                reward:action.reward,
                type:action.type
            };
        }
        return null;
    }
    
    // 之後可以再加新的事件類型
};