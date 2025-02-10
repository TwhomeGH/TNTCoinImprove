import { system } from "@minecraft/server";
export class TaskManager {
    static instance;
    /**
     * The intervals managed by the task manager.
     */
    intervals = new Map();
    /**
     * The timeouts managed by the task manager.
     */
    timeouts = new Map();
    constructor() { }
    /**
     * Gets the instance of the task manager.
     * @returns {TaskManager} The instance of the task manager.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new TaskManager();
        }
        return this.instance;
    }
    /**
    * Adds an interval to be managed.
    * @param {number} id The identifier for the interval.
    * @param {() => void} callback The function to be executed at each interval.
    * @param {number} delay The delay in ticks between each execution of the interval.
    * @returns {number} The interval id.
    */
    addInterval(id, callback, delay) {
        if (this.intervals.has(id)) {
            console.warn(`Interval with id ${id} already exists. Replacing it.`);
        }
        const intervalId = system.runInterval(callback, delay);
        this.intervals.set(id, intervalId);
        return intervalId;
    }
    /**
     * Adds a timeout to be managed.
     * @param {number} id The identifier for the timeout.
     * @param {() => void} callback The function to be executed after the delay.
     * @param {number} delay The delay in ticks before the function is executed.
     * @returns {number} The timeout id.
     */
    addTimeout(id, callback, delay) {
        if (this.timeouts.has(id)) {
            system.clearRun(this.timeouts.get(id));
        }
        const timeoutId = system.runTimeout(callback, delay);
        this.timeouts.set(id, timeoutId);
        return timeoutId;
    }
    /**
     * Gets the interval by its identifier.
     * @param {number} id The identifier of the interval.
     * @returns {number | undefined} The interval identifier.
     */
    getInterval(id) {
        return this.intervals.get(id);
    }
    /**
     * Gets the timeout by its identifier.
     * @param {number} id The identifier of the timeout.
     * @returns {number | undefined} The timeout identifier.
     */
    getTimeout(id) {
        return this.timeouts.get(id);
    }
    /**
     * Gets all intervals.
     *@returns {Map<string, number>} The intervals.
    */
    getIntervals() {
        return this.intervals;
    }
    /**
     * Gets all timeouts.
     * @returns {Map<string, number>} The timeouts.
     */
    getTimeouts() {
        return this.timeouts;
    }
    /**
     * Runs an interval.
     * @param {() => void} callback The function to be executed at each interval.
     * @param {number} delay The delay in ticks between each execution of the interval.
     */
    runInterval(callback, delay) {
        system.runInterval(callback, delay);
    }
    /**
     * Runs a timeout.
     * @param {() => void} callback The function to be executed after the delay.
     * @param {number} delay The delay in ticks before the function is executed.
     */
    runTimeout(callback, delay) {
        system.runTimeout(callback, delay);
    }
    /**
     * Clears an interval or timeout by its identifier.
     * @param {number} id The identifier of the interval or timeout.
     */
    clearTask(id) {
        if (this.intervals.has(id)) {
            system.clearRun(this.intervals.get(id));
            this.intervals.delete(id);
        }
        else if (this.timeouts.has(id)) {
            system.clearRun(this.timeouts.get(id));
            this.timeouts.delete(id);
        }
    }
    /**
     * Clears multiple intervals or timeouts by their identifiers.
     * @param {number[]} ids The identifiers of the intervals or timeouts.
     */
    clearTasks(ids) {
        ids.forEach((id) => this.clearTask(id));
    }
    /**
     * Clears all intervals and timeouts.
     */
    clearAll() {
        this.intervals.forEach((intervalId) => system.clearRun(intervalId));
        this.timeouts.forEach((timeoutId) => system.clearRun(timeoutId));
        this.intervals.clear();
        this.timeouts.clear();
    }
    /**
     * Checks if an interval or timeout exists by its identifier.
     * @param id The identifier of the interval or timeout.
     * @returns {boolean} `true` if the interval or timeout exists; otherwise, `false`.
     */
    has(id) {
        return this.intervals.has(id) || this.timeouts.has(id);
    }
}
export const taskManager = TaskManager.getInstance();
