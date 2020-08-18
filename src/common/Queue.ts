import QueueItem from "./QueueItem";

export default class Queue {
  private lastUpdateTime = 0;
  private timeRemaining = 0;
  private queue: QueueItem[] = [];

  /**
   * Sets the last time, the queue was updated
   * @param updateTime
   */
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

  public getQueue(): QueueItem[] {
    return this.queue;
  }
}
