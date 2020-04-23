import QueueItem from "./QueueItem";

/**
 * This class represents a Queue.
 */
export default class Queue {
  /**
   * The last time, the queue was updated
   */
  private lastUpdateTime = 0;

  /**
   * The remaining time for the queue
   */
  private timeRemaining = 0;

  /**
   * The queue itself
   */
  private queue: QueueItem[] = [];

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
  public getQueue(): QueueItem[] {
    return this.queue;
  }
}
