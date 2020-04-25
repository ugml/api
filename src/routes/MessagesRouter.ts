import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IMessageService from "../interfaces/IMessageService";
import IUserService from "../interfaces/IUserService";
import ILogger from "../interfaces/ILogger";

/**
 * Defines routes for message-sending and receiving
 */
export default class MessagesRouter {
  public router: Router = Router();
  private logger: ILogger;
  private userService: IUserService;
  private messageService: IMessageService;

  public constructor(container, logger: ILogger) {
    this.userService = container.userService;
    this.messageService = container.messageService;
    this.router.get("/get", this.getAllMessages);
    this.router.get("/get/:messageID", this.getMessageByID);
    this.router.post("/delete", this.deleteMessage);
    this.router.post("/send", this.sendMessage);

    this.logger = logger;
  }

  public getAllMessages = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const messages = await this.messageService.getAllMessages(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(messages ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public getMessageByID = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.messageID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.params.messageID, 10);
      const message = await this.messageService.getMessageById(userID, messageID);

      return response.status(Globals.Statuscode.SUCCESS).json(message ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public deleteMessage = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.messageID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.body.messageID, 10);

      await this.messageService.deleteMessage(userID, messageID);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public sendMessage = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (
        !InputValidator.isValidInt(request.body.receiverID) ||
        !InputValidator.isSet(request.body.subject) ||
        !InputValidator.isSet(request.body.body)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const receiverID = parseInt(request.body.receiverID, 10);
      const subject = InputValidator.sanitizeString(request.body.subject);
      const messageText = InputValidator.sanitizeString(request.body.body);

      const receiver = await this.userService.getUserById(receiverID);

      if (!InputValidator.isSet(receiver)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The receiver does not exist",
        });
      }

      await this.messageService.sendMessage(userID, receiverID, subject, messageText);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
