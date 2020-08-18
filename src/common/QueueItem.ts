export default class QueueItem {
  public unitID: number;
  public amount: number;

  // eslint-disable-next-line require-jsdoc
  public constructor(k: number, v: number) {
    this.unitID = k;
    this.amount = v;
  }
}
