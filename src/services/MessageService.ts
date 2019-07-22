import { Database } from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import { IMessageService } from "../interfaces/IMessageService";
import Message from "../units/Message";

import squel = require("safe-squel");

export default class MessageService implements IMessageService {
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

    // execute the query
    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

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

    // execute the query
    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Message(), JSON.stringify(rows[0]));
  }

  public async deleteMessage(userID: number, messageID: number) {
    const query: string = squel
      .update()
      .table("messages")
      .set("deleted", 1)
      .where("messageID = ?", messageID)
      .where("receiverID = ?", userID)
      .toString();

    // execute the query
    const [rows] = await Database.query(query);

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return rows;
  }

  public async sendMessage(senderID: number, receiverID: number, subject: string, messageText: string) {
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
