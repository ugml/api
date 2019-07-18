import "reflect-metadata";
import { NextFunction, Response, Router } from "express";
import { inject } from "inversify";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { Logger } from "../common/Logger";
import { TYPES } from "../types";

export class MessagesRouter {
  public router: Router;

  @inject(TYPES.IUserService) private userService;
  @inject(TYPES.IMessageService) private messageService;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public async getAllMessages(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      const userID = parseInt(request.userID, 10);

      const messages = await this.messageService.getAllMessages(userID);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: messages,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async getMessageByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (!InputValidator.isSet(request.params.messageID) || !InputValidator.isValidInt(request.params.messageID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.params.messageID, 10);
      const message = await this.messageService.getMessageById(userID, messageID);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: message || {},
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async deleteMessage(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (!InputValidator.isSet(request.body.messageID) || !InputValidator.isValidInt(request.body.messageID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.body.messageID, 10);

      await this.messageService.deleteMessage(userID, messageID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "The message was deleted.",
        data: {},
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async sendMessage(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (
        !InputValidator.isSet(request.body.receiverID) ||
        !InputValidator.isValidInt(request.body.receiverID) ||
        !InputValidator.isSet(request.body.subject) ||
        !InputValidator.isSet(request.body.body)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const receiverID = parseInt(request.body.receiverID, 10);
      const subject = InputValidator.sanitizeString(request.body.subject);
      const messageText = InputValidator.sanitizeString(request.body.body);

      const receiver = await this.userService.getUserById(receiverID);

      if (!InputValidator.isSet(receiver)) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "The receiver does not exist.",
          data: {},
        });
      }

      await this.messageService.sendMessage(userID, receiverID, subject, messageText);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Message sent",
        data: {},
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/get", this.getAllMessages);

    this.router.get("/get/:messageID", this.getMessageByID);

    this.router.post("/delete", this.deleteMessage);

    this.router.post("/send", this.sendMessage);
  }
}

const messagesRouter = new MessagesRouter();
messagesRouter.init();

export default messagesRouter.router;
