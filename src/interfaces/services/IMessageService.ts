import Message from "../../units/Message";
import SendMessageRequest from "../../entities/requests/SendMessageRequest";

export default interface IMessageService {
  getAllMessages(userID: number): Promise<Message[]>;
  getMessageById(messageID: number, userID: number): Promise<Message>;
  sendMessage(request: SendMessageRequest, userID: number): Promise<void>;
  deleteMessage(messageID: number, userID: number): Promise<void>;
}
