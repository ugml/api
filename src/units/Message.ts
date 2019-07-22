import { IUnits } from "../interfaces/IUnits";

export default class Message implements IUnits {
  public messageID: number;
  public senderID: number;
  public receiverID: number;
  public sendtime: number;
  public type: number;
  public subject: string;
  public body: string;
  public deleted: boolean;

  public isValid(): boolean {
    return (
      0 < this.messageID &&
      0 < this.senderID &&
      0 < this.receiverID &&
      0 < this.sendtime &&
      0 <= this.type &&
      0 < this.subject.length &&
      this.subject.length <= 45 &&
      0 < this.body.length
    );
  }
}
