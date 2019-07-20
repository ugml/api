import { Message } from "../units/Message";

export interface IMessageService {
  getAllMessages(userID: number);
  getMessageById(userID: number, messageID: number): Promise<Message>;
  deleteMessage(userID: number, messageID: number);
  sendMessage(senderID: number, receiverID: number, subject: string, messageText: string);
}
