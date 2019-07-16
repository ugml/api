class QueueItem {
  private planetID: number = -1;
  private lastUpdateTime: number = 0;
  private timeRemaining: number = 0;
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

  public addToQueue(key: string, value: number) {
    if (value <= 0) {
      return;
    }

    if (typeof this.queue[key] === "undefined") {
      this.queue[key] = value;
    }
  }
}

export { QueueItem };
