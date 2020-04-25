import IUnit from "../interfaces/IUnit";
/**
 * Represents a messages-row in the database
 */
export default class Message implements IUnit {
  /**
   * The ID of the message
   */
  public messageID: number;

  /**
   * The ID of the sender
   */
  public senderID: number;

  /**
   * The ID of the receiver
   */
  public receiverID: number;

  /**
   * The time, the message was sent
   */
  public sendtime: number;

  /**
   * The type of the message
   */
  public type: number;
  // TODO: introduce an enum of message-types

  /**
   * The subject of the message
   */
  public subject: string;

  /**
   * The text of the message
   */
  public body: string;

  /**
   * If true, the message is marked as deleted
   */
  public deleted: boolean;

  /**
   * Returns, if the contains valid data or not
   */
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
