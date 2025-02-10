import { ActionForm, ModalForm } from "./Form";
export class EventActionForm {
    _player;
    _manager;
    constructor(player, eventActionManager) {
        this._player = player;
        this._manager = eventActionManager;
    }
    get actionManager() {
        return this._manager;
    }
    showCreateActionForm(action, actionOptions) {
        const form = new ActionForm(this._player, 'Choose Action');
        actionOptions.forEach(actionOption => {
            form.button(actionOption, () => {
                this.showActionTypeForm({
                    ...action,
                    actionType: actionOption,
                }, false);
            });
        });
        form.show();
    }
    showActionTypeForm(action, isEdit, index) {
        switch (action.actionType) {
            case 'Summon':
                this.showSummonForm(action, isEdit, index);
                break;
            case 'Clear Blocks':
                this.showClearBlocksForm(action, isEdit, index);
                break;
            case 'Fill':
                this.showFillForm(action, isEdit, index);
                break;
            case 'Play Sound':
                this.showPlaySoundForm(action, isEdit, index);
                break;
            case 'Screen Title':
                this.showScreenTitleForm(action, isEdit, index);
                break;
            case 'Screen Subtitle':
                this.showScreenSubTitleForm(action, isEdit, index);
                break;
            case 'Command':
                this.CustomCommand(action,isEdit,index);
                break;
            case 'WinManger':
                this.WinManger(action,isEdit,index);
                break;
        }
    }
    
    
    
    showActionInfo(action, index) {
        let formTitle = `Action ${index + 1}`;
        let formBody = '';
        formBody += `Action Type: ${action.actionType}\n`;
        if (action.actionType === 'Fill' || action.actionType === 'Clear Blocks') {
            formBody += 'This action cannot be edited.\n';
        }
        if (action.playSound)
            formBody += `Play Sound: ${action.playSound}\n`;
        if (action.screenTitle)
            formBody += `Screen Title: ${action.screenTitle}\n`;
        if (action.screenSubtitle)
            formBody += `Screen Subtitle: ${action.screenSubtitle}\n`;
        if (action.summonOptions) {
            const { entityName, amount, locationType, onTop, batchSize, batchDelay } = action.summonOptions;
            formBody += `Entity Name: ${entityName}\n`;
            formBody += `Amount: ${amount}\n`;
            formBody += `Location Type: ${locationType}\n`;
            formBody += `On Top: ${onTop}\n`;
            formBody += `Batch Size: ${batchSize}\n`;
            formBody += `Batch Delay: ${batchDelay}\n`;
            if (action.summonOptions.playSound.playSoundOnSummon) {
                formBody += `Play Sound on Summon: ${action.summonOptions.playSound.sound}\n`;
            }
        }
        if(action.commandOptions){
            const { command }= action.commandOptions;
            formBody += `Command: ${command}`;
        }
        if(action.winOptions){
            const { win,changeMax }= action.winOptions;
            formBody += `WinAdd: ${win}\n`;
            formBody += `Change Max: ${changeMax}`
        }
        
        const form = new ActionForm(this._player, formTitle);
            form.body(formBody);
        if (action.actionType !== 'Fill' && action.actionType !== 'Clear Blocks') {
            form.button('Edit', () => this.showActionTypeForm(action, true, index));
        }
        form.button('Delete', () => this.showClearActionFromEvent(action, index));
        form.show();
    }
    

    WinManger(action,isEdit,index){
         if (action.actionType !== 'WinManger')
            return;
        const winOptions = action.winOptions || {
            win: 1,
            changeMax:false
        };
        let formTitle = `WinManger: ${isEdit ? 'Edit' : 'Create'} Action`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('number', 'Add Win', 'Add Win', winOptions.win.toString())
            .toggle("Change Max?",winOptions.changeMax)
            .submitButton('Confirm')
            .show(response => {
            const updatedwinOptions = {
                win: response[0],
                changeMax:response[1]
            };
            const updatedAction = {
                ...action,
                winOptions: updatedwinOptions,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
}
    
   CustomCommand(action,isEdit,index){
         if (action.actionType !== 'Command')
            return;
        const commandOptions = action.commandOptions || {
            command: 'say Hello'
        };
        let formTitle = `Command: ${isEdit ? 'Edit' : 'Create'} Action`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('string', 'Use Command', 'Use Command', commandOptions.command)
            .submitButton('Confirm')
            .show(response => {
            const updatedCommandOptions = {
                command: response[0]
            };
            const updatedAction = {
                ...action,
                commandOptions: updatedCommandOptions,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
}
    
    
    showSummonForm(action, isEdit, index) {
        if (action.actionType !== 'Summon')
            return;
        const summonOptions = action.summonOptions || {
            entityName: 'tnt_minecart',
            amount: 1,
            locationType: 'random',
            onTop: true,
            batchSize: 10,
            batchDelay: 10,
            playSound: {
                playSoundOnSummon: true,
                sound: 'kururin',
            }
        };
        let formTitle = `Summon: ${isEdit ? 'Edit' : 'Create'} Action`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('string', 'Entity Name', 'Entity Name', summonOptions.entityName)
            .textField('number', 'Amount', 'Amount', summonOptions.amount.toString())
            .dropdown('Location Type', ['Random', 'Center'], summonOptions.locationType === 'random' ? 0 : 1)
            .toggle('On Top', summonOptions.onTop)
            .textField('number', 'Batch Size', 'Batch Size', summonOptions.batchSize.toString())
            .textField('number', 'Batch Delay', 'Batch Delay', summonOptions.batchDelay.toString())
            .toggle('Play Sound on Summon', summonOptions.playSound.playSoundOnSummon)
            .textField('string', 'Sound', 'Sound', summonOptions.playSound.sound)
            .submitButton('Confirm')
            .show(response => {
            const updatedSummonOptions = {
                entityName: response[0],
                amount: Math.max(1, response[1]),
                locationType: response[2] === 0 ? 'random' : 'center',
                onTop: response[3],
                batchSize: Math.max(1, response[4]),
                batchDelay: Math.max(1, response[5]),
                playSound: {
                    playSoundOnSummon: response[6],
                    sound: response[7],
                }
            };
            const updatedAction = {
                ...action,
                summonOptions: updatedSummonOptions,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
    }
    showPlaySoundForm(action, isEdit, index) {
        if (action.actionType !== 'Play Sound')
            return;
        const playSound = action.playSound || 'kururin';
        let formTitle = `Play Sound: ${isEdit ? 'Edit' : 'Create'} Action`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('string', 'Play Sound', 'Play Sound', playSound)
            .submitButton('Confirm')
            .show(response => {
            const updatedPlaySound = response[0];
            const updatedAction = {
                ...action,
                playSound: updatedPlaySound,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
    }
    showClearBlocksForm(action, isEdit, index) {
        if (action.actionType !== 'Clear Blocks')
            return;
        new ActionForm(this._player, 'Clear Blocks Action')
            .body('Confirm Clear Blocks Action')
            .button('Confirm', () => {
            this._manager.addActionToEvent(action);
            this._player.sendMessage(`§aNew action added.`);
            this._player.playSound('random.orb');
        })
            .button('Cancel')
            .show();
    }
    showFillForm(action, isEdit, index) {
        if (action.actionType !== 'Fill')
            return;
        new ActionForm(this._player, 'Fill Action')
            .body('Confirm Fill Action')
            .button('Confirm', () => {
            this._manager.addActionToEvent(action);
            this._player.sendMessage(`§aNew action added.`);
            this._player.playSound('random.orb');
        })
            .button('Cancel')
            .show();
    }
    showScreenTitleForm(action, isEdit, index) {
        if (action.actionType !== 'Screen Title')
            return;
        const screenTitle = action.screenTitle || 'Title';
        let formTitle = `${isEdit ? 'Edit Screen Title' : 'Screen Title Action'}`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('string', 'Title', 'Title', screenTitle)
            .submitButton('Confirm')
            .show(response => {
            const updatedScreenTitle = response[0];
            const updatedAction = {
                ...action,
                screenTitle: updatedScreenTitle,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
    }
    showScreenSubTitleForm(action, isEdit, index) {
        if (action.actionType !== 'Screen Subtitle')
            return;
        const screenTitle = action.screenTitle || 'Subtitle';
        let formTitle = `${isEdit ? 'Edit Screen Subtitle' : 'Screen Subtitle Action'}`;
        formTitle += index !== undefined ? ` ${index + 1}` : '';
        new ModalForm(this._player, formTitle)
            .textField('string', 'Subtitle', 'Subtitle', screenTitle)
            .submitButton('Confirm')
            .show(response => {
            const subtitle = response[0];
            const updatedAction = {
                ...action,
                screenSubtitle: subtitle,
            };
            if (isEdit && index !== undefined) {
                this._manager.updateActionInEvent(action.eventKey, index, updatedAction);
                this._player.sendMessage(`§aAction updated.`);
            }
            else {
                this._manager.addActionToEvent(updatedAction);
                this._player.sendMessage(`§aNew action added.`);
            }
            this._player.playSound('random.orb');
        });
    }
    showClearAllActionsForm(actions) {
        new ActionForm(this._player, 'Clear All Actions')
            .body('Are you sure you want to clear all actions?')
            .button('Yes', () => {
            actions.forEach(action => {
                this._manager.removeAllActionsFromEvent(action[0].eventKey);
            });
            this._player.sendMessage('§cAll actions cleared.');
            this._player.playSound('random.orb');
        })
            .button('No')
            .show();
    }
    showClearActionFromEvent(action, index) {
        new ActionForm(this._player, 'Clear Action')
            .body(`Are you sure you want to clear this action?`)
            .button('Yes', () => {
            this._manager.removeActionFromEvent(action.eventKey, index);
            this._player.sendMessage(`§cAction deleted.`);
            this._player.playSound('random.orb');
        })
            .button('No')
            .show();
    }
    showClearAllActionsFromEvent(eventKey) {
        new ActionForm(this._player, 'Clear All Actions')
            .body(`Are you sure you want to clear all actions?`)
            .button('Yes', () => {
            this._manager.removeAllActionsFromEvent(eventKey);
            this._player.sendMessage(`§cAll actions cleared.`);
            this._player.playSound('random.orb');
        })
            .button('No')
            .show();
    }
}
