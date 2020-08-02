import { Response } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IMessageService from "../interfaces/services/IMessageService";
import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Route, Security, Tags } from "tsoa";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import SendMessageRequest from "../entities/requests/SendMessageRequest";
import DeleteMessageRequest from "../entities/requests/DeleteMessageRequest";
import { provide } from "inversify-binding-decorators";
import FailureResponse from "../entities/responses/FailureResponse";

@Tags("Messages")
@Route("messages")
@provide(MessagesRouter)
export class MessagesRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IMessageService) private messageService: IMessageService;

  @Security("jwt")
  @Get()
  public getAllMessages = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const messages = await this.messageService.getAllMessages(userID);

      return response.status(Globals.StatusCodes.SUCCESS).json(messages ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.StatusCodes.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  @Security("jwt")
  @Get("/{messageID}")
  public async getMessageByID(@Request() headers, messageID: number) {
    try {
      const userID = headers.user.userID;
      const message = await this.messageService.getMessageById(userID, messageID);

      return message;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Security("jwt")
  @Post("/send")
  public async sendMessage(@Request() headers, @Body() request: SendMessageRequest) {
    try {
      const subject = InputValidator.sanitizeString(request.subject);
      const messageText = InputValidator.sanitizeString(request.body);

      const receiver = await this.userService.getUserById(request.receiverID);

      if (!InputValidator.isSet(receiver)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return new FailureResponse("The receiver does not exist");
      }

      return await this.messageService.sendMessage(headers.user.userID, request.receiverID, subject, messageText);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }

  @Security("jwt")
  @Post("/delete")
  public async deleteMessage(@Request() headers, @Body() request: DeleteMessageRequest) {
    try {
      return await this.messageService.deleteMessage(headers.user.userID, request.messageID);
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);

      return new FailureResponse("There was an error while handling the request.");
    }
  }
}
