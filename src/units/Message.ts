import IUnit from "../interfaces/IUnit";

/**
 * Represents a messages-row in the database
 */
export default class Message implements IUnit {
  public messageID: number;
  public senderID: number;
  public receiverID: number;
  public sendtime: number;
  public type: number; // TODO: introduce an enum of message-types
  public subject: string;
  public body: string;
  public deleted: boolean;

  public isValid(): boolean {
    return (
      0 < this.messageID &&
      0 < this.senderID &&
      0 < this.receiverID &&
      this.senderID !== this.receiverID &&
      0 < this.sendtime &&
      0 <= this.type &&
      0 < this.subject.length &&
      this.subject.length <= 45 &&
      0 < this.body.length
    );
  }
}
