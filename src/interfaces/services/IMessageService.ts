import Message from "../../units/Message";
import SendMessageRequest from "../../entities/requests/SendMessageRequest";

export default interface IMessageService {
  getAll(userID: number): Promise<Message[]>;
  getById(messageID: number, userID: number): Promise<Message>;
  send(request: SendMessageRequest, userID: number): Promise<void>;
  delete(messageID: number, userID: number): Promise<void>;
}
