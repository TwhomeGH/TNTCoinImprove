import { DynamicPropertiesManager } from "./DynamicPropertiesManager";
export class EventActionManager {
    _propertiesManager;
    _propertyKey;
    _eventActions = new Map();
    /**
     * Creates a new instance of the EventActionManager class.
     * @param {Player} player The player to manage event actions for.
     * @param {string} key The key to use for saving event actions.
     */
    constructor(player, key) {
        this._propertiesManager = new DynamicPropertiesManager(player);
        this._propertyKey = `${key}:actions`;
        this.loadAllEventActions();
    }
    /**
     * Adds a new action to an event.
     * @param action The action to add.
     */
    addActionToEvent(action) {
        const actions = this._eventActions.get(action.eventKey) || [];
        actions.push(action);
        this._eventActions.set(action.eventKey, actions);
        this.saveAllEventActions();
    }
    /**
     * Removes a specific action from an event.
     * @param {string} eventKey The name of the event.
     * @param {number} index The index of the action to remove.
     */
    removeActionFromEvent(eventKey, index) {
        const actions = this._eventActions.get(eventKey);
        if (actions && actions[index]) {
            actions.splice(index, 1);
            actions.length === 0 ? this._eventActions.delete(eventKey) : this._eventActions.set(eventKey, actions);
            this.saveAllEventActions();
        }
        else {
            console.warn(`No action found at index ${index} for event ${eventKey}`);
        }
    }
    /**
     * Removes all actions from a specific event.
     * @param {string} eventKey The name of the event.
     */
    removeAllActionsFromEvent(eventKey) {
        this._eventActions.delete(eventKey);
        this.saveAllEventActions();
    }
    /**
     * Updates a specific action in an event.
     * @param {string} eventKey The name of the event.
     * @param {number} index The index of the action to update.
     * @param updatedAction The updated action properties.
     */
    updateActionInEvent(eventKey, index, updatedAction) {
        const actions = this._eventActions.get(eventKey);
        if (actions && actions[index]) {
            const action = actions[index];
            Object.keys(updatedAction).forEach((key) => {
                const value = updatedAction[key];
                if (value !== undefined) {
                    action[key] = value;
                }
            });
            this.saveAllEventActions();
        }
        else {
            console.warn(`No action found at index ${index} for event ${eventKey}`);
        }
    }
    /**
     * Save all event actions to dynamic properties of the player.
     */
    saveAllEventActions() {
        try {
            const serializedActions = this._eventActions.size === 0 ? "[]" : JSON.stringify(Array.from(this._eventActions.entries()));
            this._propertiesManager.setProperty(this._propertyKey, serializedActions);
            console.warn("Actions saved successfully.");
        }
        catch (error) {
            console.error(`Failed to save player actions: ${error}`);
            throw error;
        }
    }
    /**
     * Load all event actions from dynamic properties of the player.
     */
    loadAllEventActions() {
        try {
            const serializedActions = this._propertiesManager.getProperty(this._propertyKey);
            if (serializedActions && serializedActions !== "[]") {
                const parsedActions = JSON.parse(serializedActions);
                if (Array.isArray(parsedActions)) {
                    this._eventActions = new Map(parsedActions);
                    console.warn("Actions loaded successfully.");
                }
                else {
                    console.warn("Parsed actions are not in a valid format.");
                    this._eventActions.clear();
                }
            }
            else {
                console.warn("No actions found to load.");
                this._eventActions.clear();
            }
        }
        catch (error) {
            console.error(`Failed to load player actions: ${error}`);
            this._eventActions.clear();
        }
    }
    /**
     * Clears all event actions.
     */
    clearAllEventActions() {
        if (this._eventActions.size === 0)
            return;
        this._eventActions.clear();
        this.saveAllEventActions();
    }
    /**
     * Clears all actions for a specific event.
     * @param {string} eventKey The name of the event.
     */
    clearActionsForEvent(eventKey) {
        this._eventActions.delete(eventKey);
        this.saveAllEventActions();
    }
    /**
     * Retrieves all actions for a specific event.
     * @param {string} eventKey The name of the event.
     * @returns An array of actions or undefined if no actions are found.
     */
    getActionsForEvent(eventKey) {
        return this._eventActions.get(eventKey);
    }
    /**
     * Retrieves all events.
     * @returns A map of all events.
     */
    getAllEvents() {
        return this._eventActions;
    }
}
