import { ActionForm } from "../../core/Form";
import { EventActionForm } from "../../core/EventActionForm";
import { EventActionFormBase } from "./EventActionFormBase";
export class FollowActionForm extends EventActionFormBase {
    _eventKey = 'follow';
    constructor(player, followActionManager) {
        super(player, new EventActionForm(player, followActionManager));
    }
    show() {
        const followActions = this._eventActionForm.actionManager.getAllEvents().get(this._eventKey);
        const form = new ActionForm(this._player, 'Follow Actions');
        if (followActions) {
            form.body(`§2§kii§r§fTotal Actions: §d${followActions.length}§2§kii§r\nExecuted when viewer follows you!`);
            followActions.forEach((action, index) => {
                form.button(`§2§kii§r§8${index + 1}. ${action.actionType}§2§kii§r§r`, () => {
                    this._eventActionForm.showActionInfo(action, index);
                });
            });
        }
        form.button('Create New Follow Action', () => {
            this._eventActionForm.showCreateActionForm({
                eventKey: this._eventKey,
            }, this._actionOptions);
        });
        form.button('Clear All Actions', () => {
            this._eventActionForm.showClearAllActionsFromEvent(this._eventKey);
        });
        form.show();
    }
}
