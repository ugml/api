import IMessageRepository from "../interfaces/repositories/IMessageRepository";
import Message from "../units/Message";
import Database from "../common/Database";
import InputValidator from "../common/InputValidator";
import SerializationHelper from "../common/SerializationHelper";
import * as squel from "safe-squel";
import { injectable } from "inversify";

@injectable()
export default class MessageRepository implements IMessageRepository {
  public async exists(id: number): Promise<boolean> {
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
      .where("messageID = ?", id)
      .where("deleted = ?", 0)
      .toString();

    const [rows] = await Database.query(query.toString());

    return InputValidator.isSet(rows);
  }

  public async getById(id: number): Promise<Message> {
    const query: string = squel
      .select()
      .from("messages")
      .where("messageID = ?", id)
      .where("deleted = ?", 0)
      .toString();

    const [rows] = await Database.query(query.toString());

    if (!InputValidator.isSet(rows)) {
      return null;
    }

    return SerializationHelper.toInstance(new Message(), JSON.stringify(rows[0]));
  }

  public async save(t: Message): Promise<void> {
    const query: string = squel
      .update()
      .table("messages", "m")
      .set("senderID", t.senderID)
      .set("receiverID", t.receiverID)
      .set("sendtime", t.sendtime)
      .set("type", t.type)
      .set("subject", t.subject)
      .set("body", t.body)
      .set("deleted", t.deleted)
      .toString();

    await Database.query(query);
  }

  public async create(t: Message): Promise<Message> {
    const query: string = squel
      .insert()
      .into("messages")
      .set("senderID", t.senderID)
      .set("receiverID", t.receiverID)
      .set(
        "sendtime",
        new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      )
      .set("type", t.type)
      .set("subject", t.subject)
      .set("body", t.body)
      .set("deleted", false)
      .toString();

    await Database.query(query);
    // TODO: set messageID
    return t;
  }

  public async delete(userID: number, messageID: number): Promise<void> {
    const query: string = squel
      .update()
      .table("messages")
      .set("deleted", 1)
      .where("messageID = ?", messageID)
      .where("receiverID = ?", userID)
      .toString();

    await Database.query(query);
  }

  public async getAll(userID: number): Promise<Message[]> {
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
}
