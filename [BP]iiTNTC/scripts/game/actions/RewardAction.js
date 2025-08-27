import { EventActionForm } from "../../core/EventActionForm";
import { ActionForm, ModalForm } from "../../core/Form";
import { EventActionFormBase } from "./EventActionFormBase";
export class REActionForm extends EventActionFormBase {
    constructor(player, rewardActionManager) {
        super(player, new EventActionForm(player, rewardActionManager));
    }
    show() {
        const chatEvents = this._eventActionForm.actionManager.getAllEvents();
        const form = new ActionForm(this._player, 'Reward Actions');
     
        chatEvents.forEach((actions, eventKey) => {
            form.button(`§2§kii§r§e${eventKey}:${actions[0].type}§2§kii§r\n§2Actions: [${actions.length}]`, () => {
                this.showRActionsForm(eventKey, `Actions for ${eventKey} Reward`, actions);
            });
        });
        form.button('Create New Chat Action', () => this.showCreateNewActionForm());
        form.button('Clear All Actions', () => this._eventActionForm.showClearAllActionsForm(chatEvents));
        form.show();
    }
    showCreateNewActionForm() {
        new ModalForm(this._player, 'Create New Reward Action')
            .textField('number', 'Enter the number for action', "50", "100")
            .dropdown('Type', ['Bits', 'Reward'], 0)
            .submitButton('Continue')
            .show(response => {
            const chat = response[0];
            const typeIndex = response[1]; // 選單的索引
            const types = ['Bits', 'Reward']; 
            const chat2 = types[typeIndex];  // 真正的 type 值

            this._eventActionForm.showCreateActionForm({
                eventKey: chat,
                type:chat2
            }, this._actionOptions);
        });
    }
    showRActionsForm(eventKey, formTitle, chatActions) {
        const form = new ActionForm(this._player, formTitle);
        console.log(JSON.stringify(chatActions,null,4))
        
        let typelist=chatActions.map(action => action.type)
        form.body(`§2§kii§r§fTotal Actions: §d${chatActions.length}§2§kii§r\nUse Point: §e${eventKey}§f\nType:${typelist}`);
        chatActions.forEach((action, index) => {
            let text = '';
            if (action.type){
                text += ` - ${action.type}`
            }
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
