import { system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
class FormComponentBuilder {
    static createComponent(component, form) {
        switch (component.type) {
            case 'button':
                form.button(component.label, component.iconPath);
                break;
            case 'textField':
                form.textField(component.label, component.placeholder, component.defaultValue);
                break;
            case 'dropdown':
                form.dropdown(component.label, component.options, component.defaultValue);
                break;
            case 'slider':
                form.slider(component.label, component.min, component.max, component.step, component.defaultValue);
                break;
            case 'toggle':
                form.toggle(component.label, component.defaultValue);
                break;
            case 'submitButton':
                form.submitButton(component.label);
                break;
            default:
                throw new Error(`Unknown form component type: ${component.type}`);
        }
    }
}
/**
 * Abstract class representing a form for Minecraft UI.
 */
class Form {
    components;
    player;
    title;
    constructor(player, title) {
        this.player = player;
        this.title = title;
        this.components = [];
    }
    addComponent(component) {
        this.components.push(component);
    }
}
/**
 * Class representing an action form.
 */
class ActionForm extends Form {
    _body;
    button(label, callback, iconPath) {
        this.addComponent({ type: 'button', label, iconPath, callback });
        return this;
    }
    body(body) {
        this._body = body;
        return this;
    }
    show() {
        const form = new ActionFormData().title(this.title);
        if (this._body) {
            form.body(this._body);
        }
        this.components.forEach(component => {
            FormComponentBuilder.createComponent(component, form);
        });
        system.run(async () => {
            const response = await form.show(this.player);
            if (!response.canceled && this.components[response.selection]?.callback) {
                await Promise.resolve(this.components[response.selection].callback(response.selection));
            }
        });
    }
}
/**
 * Class representing a modal form.
 */
class ModalForm extends Form {
    textField(textfieldType, label, placeholder, defaultValue, callback) {
        this.addComponent({ type: 'textField', label, placeholder, defaultValue, callback, textfieldType });
        return this;
    }
    dropdown(label, options, defaultValue, callback) {
        this.addComponent({ type: 'dropdown', label, options, defaultValue, callback });
        return this;
    }
    slider(label, min, max, step, defaultValue, callback) {
        this.addComponent({ type: 'slider', label, min, max, step, defaultValue, callback });
        return this;
    }
    toggle(label, defaultValue, callback) {
        this.addComponent({ type: 'toggle', label, defaultValue, callback });
        return this;
    }
    submitButton(label) {
        this.addComponent({ type: 'submitButton', label });
        return this;
    }
    show(onSubmit = () => { }) {
        const form = new ModalFormData().title(this.title);
        this.components.forEach(component => {
            FormComponentBuilder.createComponent(component, form);
        });
        system.run(async () => {
            const response = await form.show(this.player);
            if (!response.canceled && onSubmit) {
                try {
                    const validatedValues = this.components.map((component, index) => {
                        const value = response.formValues[index];
                        return component.type === 'textField'
                            ? this.validateTextField(component.textfieldType, value)
                            : value;
                    });
                    this.components.forEach((component, index) => {
                        if (component.callback) {
                            component.callback(validatedValues[index]);
                        }
                    });
                    onSubmit(validatedValues);
                }
                catch (error) {
                    console.error('Error in form validation: ', error);
                    this.player.sendMessage(`§c${error.message}`);
                    this.player.playSound('item.shield.block');
                }
            }
        });
    }
    validateTextField(valueType, value) {
        switch (valueType) {
            case 'number':
                const numberValue = Number(value);
                if (isNaN(numberValue)) {
                    throw new Error(`Invalid number value: ${value}`);
                }
                return numberValue;
            case 'string':
                if (/^\d+$/.test(value) || value === '') {
                    throw new Error(`Invalid string value: ${value}`);
                }
                return value;
            default:
                throw new Error(`Unknown value type: ${valueType}`);
        }
    }
}
export { ActionForm, ModalForm, FormComponentBuilder };
