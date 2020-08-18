import IMessageService from "../interfaces/services/IMessageService";

import { inject, injectable } from "inversify";
import Message from "../units/Message";
import TYPES from "../ioc/types";
import IMessageRepository from "../interfaces/repositories/IMessageRepository";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import InputValidator from "../common/InputValidator";

import SendMessageRequest from "../entities/requests/SendMessageRequest";
import IUserRepository from "../interfaces/repositories/IUserRepository";
import ApiException from "../exceptions/ApiException";

@injectable()
export default class MessageService implements IMessageService {
  @inject(TYPES.IMessageRepository) private messageRepository: IMessageRepository;
  @inject(TYPES.IUserRepository) private userRepository: IUserRepository;

  public async getAll(userID: number): Promise<Message[]> {
    return await this.messageRepository.getAll(userID);
  }

  public async getById(messageID: number, userID: number): Promise<Message> {
    const message = await this.messageRepository.getById(messageID);

    if (!InputValidator.isSet(message)) {
      throw new ApiException("Message does not exist");
    }

    if (message.receiverID !== userID) {
      throw new UnauthorizedException("User was not the receiver");
    }

    return message;
  }

  public async send(request: SendMessageRequest, userID: number): Promise<void> {
    const receiver = await this.userRepository.getById(request.receiverID);

    if (!InputValidator.isSet(receiver)) {
      throw new ApiException("The receiver does not exist");
    }

    const message: Message = {
      senderID: userID,
      receiverID: request.receiverID,
      type: 1, // TODO
      subject: request.subject,
      body: request.body,
    } as Message;

    await this.messageRepository.create(message);
  }

  public async delete(messageID: number, userID: number): Promise<void> {
    const message: Message = await this.messageRepository.getById(messageID);

    if (!InputValidator.isSet(message)) {
      throw new ApiException("Message does not exist");
    }

    if (message.receiverID !== userID) {
      throw new UnauthorizedException("Message was not sent to user");
    }

    message.deleted = true;

    await this.messageRepository.save(message);
  }
}
