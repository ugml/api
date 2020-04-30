import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import IMessageDataAccess from "../interfaces/dataAccess/IMessageDataAccess";
import Message from "../units/Message";

import squel = require("safe-squel");

/**
 * This class defines a DataAccess to interact with the messages-table in the database
 */
export default class MessageDataAccess implements IMessageDataAccess {
  /**
   * Returns a list of all messages a user has sent or received
   * @param userID the ID of the user
   */
  public async getAllMessages(userID: number) {
    const query: string = squel
      .select()
      .from("messages")
      .field("messageID")
      .field("senderID")
      .field("receiverID")
      .field("sendtime")
      .field("type")
      .field("subject")
      .field("body")
      .where("receiverID = ?", userID)
      .where("deleted = ?", 0)
      .order("sendtime", false)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  /**
   * Returns a specific message given the messageID and the sender- or receiverID
   * @param userID the sender- or receiverID
   * @param messageID the ID of the message
   */
  public async getMessageById(userID: number, messageID: number): Promise<Message> {
    const query: string = squel
      .select()
      .from("messages")
      .field("messageID")
      .field("senderID")
      .field("receiverID")
      .field("sendtime")
      .field("type")
      .field("subject")
      .field("body")
      .where("receiverID = ?", userID)
      .where("messageID = ?", messageID)
      .where("deleted = ?", 0)
      .toString();

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Message(), JSON.stringify(rows[0]));
  }

  /**
   * Marks a message as deleted in the database
   * @param userID the ID of the user
   * @param messageID the ID of the message
   */
  public async deleteMessage(userID: number, messageID: number) {
    const query: string = squel
      .update()
      .table("messages")
      .set("deleted", 1)
      .where("messageID = ?", messageID)
      .where("receiverID = ?", userID)
      .toString();

    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  /**
   * Sends a new message
   * @param senderID the ID of the sender
   * @param receiverID the ID of the receiver
   * @param subject the subject of the message
   * @param messageText the message-text
   */
  public async sendMessage(senderID: number, receiverID: number, subject: string, messageText: string) {
    // TODO: set unread-message-count + 1 at receiver?
    const query: string = squel
      .insert()
      .into("messages")
      .set("senderID", senderID)
      .set("receiverID", receiverID)
      .set(
        "sendtime",
        new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      )
      .set("type", 1)
      .set("subject", subject)
      .set("body", messageText)
      .toString();

    await Database.query(query);
  }
}
