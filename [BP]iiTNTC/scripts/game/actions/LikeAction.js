import { EventActionForm } from "../../core/EventActionForm";
import { ActionForm, ModalForm } from "../../core/Form";
import { EventActionFormBase } from "./EventActionFormBase";
export class LikeActionForm extends EventActionFormBase {
    constructor(player, likeActionManager) {
        super(player, new EventActionForm(player, likeActionManager));
    }
    show() {
        const likeEvents = this._eventActionForm.actionManager.getAllEvents();
        const form = new ActionForm(this._player, 'Like Actions');
        likeEvents.forEach((actions, eventKey) => {
            form.button(`§2§kii§r§4${eventKey}§8 Likes§2§kii§r\n§2Actions: [${actions.length}]`, () => {
                this.showLikeActionsForm(eventKey, `Actions for ${eventKey} Likes`, actions);
            });
        });
        form.button('Create New Like Action', () => this.showCreateNewActionForm());
        form.button('Clear All Actions', () => this._eventActionForm.showClearAllActionsForm(likeEvents));
        form.show();
    }
    showCreateNewActionForm() {
        new ModalForm(this._player, 'Create New Like Action')
            .textField('number', 'Enter the number of likes for action', '', '100')
            .submitButton('Continue')
            .show(response => {
            const amount = Math.max(1, parseInt(response[0]));
            this._eventActionForm.showCreateActionForm({
                eventKey: amount.toString(),
                likeCount: amount,
            }, this._actionOptions);
        });
    }
    showLikeActionsForm(eventKey, formTitle, likeActions) {
        const form = new ActionForm(this._player, formTitle);
        form.body(`§2§kii§r§fTotal Actions: §d${likeActions.length}§2§kii§r\nExecuted when viewer sends §e${eventKey}§f likes!`);
        likeActions.forEach((action, index) => {
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
        form.button('Clear All Actions', () => {
            this._eventActionForm.showClearAllActionsFromEvent(eventKey);
        });
        form.show();
    }
}
