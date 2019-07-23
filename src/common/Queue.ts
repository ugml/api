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
  private queue: Map<string, number>;

  /**
   * Creates a new Queue-instance
   */
  public constructor() {
    this.queue = new Map<string, number>();
  }

  /**
   * Sets the planetID
   * @param planetID
   */
  public setPlanetID(planetID: number) {
    this.planetID = planetID;
  }

  /**
   * Returns the planetID
   */
  public getPlanetID(): number {
    return this.planetID;
  }

  /**
   * Sets the last time, the queue was updated
   * @param updateTime
   */
  public setLastUpdateTime(updateTime: number) {
    this.lastUpdateTime = updateTime;
  }

  /**
   * Returns the last time, the queue was updated
   */
  public getLastUpdateTime(): number {
    return this.lastUpdateTime;
  }

  /**
   * Sets the time remaining
   * @param timeRemaining
   */
  public setTimeRemaining(timeRemaining: number) {
    this.timeRemaining = timeRemaining;
  }

  /**
   * Returns the time remaining
   */
  public getTimeRemaining(): number {
    return this.timeRemaining;
  }

  /**
   * Returns the queue
   */
  public getQueue(): Map<string, number> {
    return this.queue;
  }
}
