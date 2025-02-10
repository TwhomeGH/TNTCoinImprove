/**
 * Class for managing event handlers.
 * @template T - The context type.
 */
export class EventHandlerRegistry {
    handlers = new Map();
    enabledEvents = new Set();
    /**
     * Registers an event handler for a specific event.
     * @param {string} event The event name.
     * @param {EventHandler<T>} handler The handler function.
     */
    register(event, handler) {
        this.handlers.set(event, handler);
        this.enableEvent(event);
    }
    /**
     * Retrieves the handler for a specific event.
     * @param {string} event The event name.
     * @returns {EventHandler<T> | undefined} The handler function, or undefined if no handler is registered for the event.
     */
    getHandler(event) {
        return this.handlers.get(event);
    }
    /**
     * Get all events.
     * @returns {string[]} The list of events.
     */
    getAllEvents() {
        return Array.from(this.handlers.keys());
    }
    /**
     * Enables an event.
     * @param {string} event The event name.
     */
    enableEvent(event) {
        this.enabledEvents.add(event);
    }
    /**
     * Disables an event.
     * @param {string} event The event name.
     */
    disableEvent(event) {
        this.enabledEvents.delete(event);
    }
    /**
     * Checks if an event is enabled.
     * @param {string} event The event name.
     * @returns {boolean} `true` if the event is enabled, `false` otherwise.
     */
    isEventEnabled(event) {
        return this.enabledEvents.has(event);
    }
}
