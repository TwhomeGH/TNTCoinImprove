import { ActionForm, ModalForm } from "../../core/Form";
import { DEFAULT_GIFT, TIKTOK_GIFT } from "../../lang/tiktokGifts";
import { EventActionForm } from "../../core/EventActionForm";
import { EventActionFormBase } from "./EventActionFormBase";
export class GiftActionForm extends EventActionFormBase {
    constructor(player, giftActionManager) {
        super(player, new EventActionForm(player,giftActionManager));
    }
    show() {
        const giftEvents = this._eventActionForm.actionManager.getAllEvents();
        const form = new ActionForm(this._player, 'Gift Actions');
        giftEvents.forEach((actions, eventKey) => {
            let giftName = '';
            let giftEmoji = '';
            actions.forEach((action, index) => {
                giftName = action.giftName;
                giftEmoji = action.giftEmoji;
            });
            form.button(`§2§kii§r§8${giftEmoji}§e${giftName}§2§kii§r\n§2Actions: [${actions.length}]`, () => {
                this.showGiftActions(eventKey, giftEmoji, giftName, actions);
            });
        });
        form.button('Create New Gift Action', this.showCreateNewActionForm.bind(this));
        form.button('Clear All Actions', () => this._eventActionForm.showClearAllActionsForm(giftEvents));
        form.show();
    }
    showCreateNewActionForm() {
        const availableGifts = Object.keys(TIKTOK_GIFT).filter(giftName => TIKTOK_GIFT[giftName].id !== null && TIKTOK_GIFT[giftName].emoji !== '');
        const giftOptions = availableGifts.map(giftName => {
            const gift = TIKTOK_GIFT[giftName];
            const giftEmoji = gift.emoji || DEFAULT_GIFT;
            const giftCoin=gift.coins;
            return `${giftEmoji} ${giftName} ${giftCoin}`;
        });
        new ModalForm(this._player, 'Create New Gift Action')
            .dropdown('Select Gift to Add Action', giftOptions, 5)
            .submitButton('Continue')
            .show(response => {
            const selectedGift = response[0];
            const giftName = availableGifts[selectedGift];
            const gift = TIKTOK_GIFT[giftName];
            const giftId = gift.id;
            const giftEmoji = gift.emoji || DEFAULT_GIFT;
            this._eventActionForm.showCreateActionForm({
                eventKey: giftId?.toString() || giftName,
                giftName: giftName,
                giftId: giftId,
                giftEmoji: giftEmoji,
            }, this._actionOptions);
        });
    }
    showGiftActions(eventKey, giftEmoji, giftName, giftActions) {
        const form = new ActionForm(this._player, `Actions for ${giftEmoji}${giftName}`);
        form.body(`§2§kii§r§fTotal Actions: §d${giftActions.length}§2§kii§r\nExecuted when viewer sends a §e${giftEmoji}${giftName}§f gift.`);
        giftActions.forEach((action, index) => {
            let text = '';
            if (action.actionType === 'Summon') {
                text += ` - ${action.summonOptions.entityName.toUpperCase()} x${action.summonOptions?.amount}`;
            }
            else if (action.actionType === 'Play Sound') {
                text += ` - ${action.playSound}`;
            }
            form.button(`§2§kii§r§8${index + 1}. ${action.actionType}${text}§2§kii§r`, () => {
                this._eventActionForm.showActionInfo(action, index);
            });
        });
        form.button('Clear All Actions for this Gift', () => {
            this._eventActionForm.showClearAllActionsFromEvent(eventKey);
        });
        form.show();
    }
}
