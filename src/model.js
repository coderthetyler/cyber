
/**
 * Assumptions:
 * 1. Date.now() always returns the "correct" time on every client.
 * 2. A timer's start time < end time.
 * 3. clientId is unique, somehow.
 */

/**
 * A project is the thing being worked on.
 */
export class Project {
    /**
     * Create a new project.
     * @param {string} name - Human-readable project name. This is used as an identifier & should be short.
     * @param {string} description - Human-readable project description. This should be longer & more descriptive.
     */
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

/**
 * A tag is metadata associated with a timer.
 */
export class Tag {
    /**
     * Create a new tag.
     * @param {string} name - Human-readable tag name. This is used as an identifier & should be short.
     * @param {string} description - Human-readable tag description. This should be longer & more descriptive.
     */
    constructor(name, description) {
        this.name = name
        this.description = description
    }
}

/**
 * A unique identifier for a connected client.
 */
export class Client {
    /**
     * Create a new client.
     * @param {string} clientId 
     */
    constructor(clientId) {
        this.clientId = clientId
    }
}

/**
 * A saved timer configuration.
 */
export class Timer {
    /**
     * Create a timer.
     * @param {Project} project - Project associated with the timer.
     * @param {string} description - Description of the timed activity.
     * @param {Tag[]} tags - Tags associated with the timer.
     */
    constructor(project, description, tags) {
        this.project = project
        this.description = description
        this.tags = tags
    }
}

/**
 * A time entry with a start time but without an end time.
 */
export class PendingTimeEntry {
    /**
     * Create a new pending time entry.
     * @param {Timer} timer 
     * @param {Client} client 
     * @param {Date} startTime 
     */
    constructor(timer, client, startTime) {
        this.timer = timer
        this.client = client
        this.startTime = startTime
    }
}

/**
 * A time entry with both a start & an end time.
 */
export class CompletedTimeEntry {
    /**
     * Create a new completed time entry.
     * @param {Timer} timer 
     * @param {Client} client 
     * @param {Date} startTime 
     * @param {Date} endTime 
     */
    constructor(timer, client, startTime, endTime) {
        this.timer = timer
        this.client = client
        this.startTime = startTime
        this.endTime = endTime
    }
}
