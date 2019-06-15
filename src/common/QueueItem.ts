class QueueItem {

    private planetID: number;
    private lastUpdateTime: number;
    private timeRemaining: number;
    private queue: object;

    public constructor() {
        this.planetID = -1;
        this.lastUpdateTime = 0;
        this.timeRemaining = 0;
        this.queue = {};
    }

    public setPlanetID(planetID: number) {
        this.planetID = planetID;
    }

    public setLastUpdateTime(updateTime: number) {
        this.lastUpdateTime = updateTime;
    }

    public setTimeRemaining(timeRemaining: number) {
        this.timeRemaining = timeRemaining;
    }

    public getQueue() {
        return this.queue;
    }

    public addToQueue(key: string, value: number) {

        if (value <= 0) { return; }

        if (this.queue[key] === undefined) {
            this.queue[key] = value;
        }
    }

}

export { QueueItem };
