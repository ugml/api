import IRepository from "./IRepository";
import Message from "../../units/Message";

export default interface IMessageRepository extends IRepository<Message> {
  getAll(userID: number): Promise<Message[]>;
  delete(userID: number, messageID: number): Promise<void>;
}
