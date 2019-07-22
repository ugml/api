/**
 * This class represents a Queue.
 * A Queue is part of a build-queue.
 */
export default class Queue {
  /**
   * The planetID, on which the queue will be processed
   */
  private planetID: number = -1;

  /**
   * The last time, the queue was updated
   */
  private lastUpdateTime: number = 0;

  /**
   * The remaining time for the queue
   */
  private timeRemaining: number = 0;

  /**
   * The queue itself
   */
  private queue: object = {};

  public setPlanetID(planetID: number) {
    this.planetID = planetID;
  }

  public getPlanetID(): number {
    return this.planetID;
  }

  public setLastUpdateTime(updateTime: number) {
    this.lastUpdateTime = updateTime;
  }

  public getLastUpdateTime(): number {
    return this.lastUpdateTime;
  }

  public setTimeRemaining(timeRemaining: number) {
    this.timeRemaining = timeRemaining;
  }

  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  public getQueue() {
    return this.queue;
  }

  /**
   * Appends a new build-order to the queue
   * @param key the key of the unit
   * @param value the amount of units to be built in this order
   */
  public addToQueue(key: string, value: number) {
    if (value <= 0) {
      return;
    }

    if (typeof this.queue[key] === "undefined") {
      this.queue[key] = value;
    }
  }
}
