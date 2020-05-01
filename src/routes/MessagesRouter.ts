import { Response, Router } from "express";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import ILogger from "../interfaces/ILogger";
import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import IMessageDataAccess from "../interfaces/dataAccess/IMessageDataAccess";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import Exception from "../exceptions/Exception";

/**
 * Defines routes for message-sending and receiving
 */
export default class MessagesRouter {
  public router: Router = Router();
  private logger: ILogger;
  private userDataAccess: IUserDataAccess;
  private messageDataAccess: IMessageDataAccess;

  public constructor(container, logger: ILogger) {
    this.userDataAccess = container.userDataAccess;
    this.messageDataAccess = container.messageDataAccess;
    this.router.get("/get", this.getAllMessages);
    this.router.get("/get/:messageID", this.getMessageByID);
    this.router.post("/delete", this.deleteMessage);
    this.router.post("/send", this.sendMessage);

    this.logger = logger;
  }

  public getAllMessages = async (request: IAuthorizedRequest, response: Response) => {
    try {
      const userID = parseInt(request.userID, 10);

      const messages = await this.messageDataAccess.getAllMessages(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(messages ?? {});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public getMessageByID = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.params.messageID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.params.messageID, 10);
      const message = await this.messageDataAccess.getMessageById(userID, messageID);

      return response.status(Globals.Statuscode.SUCCESS).json(message ?? {});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };

  public deleteMessage = async (request: IAuthorizedRequest, response: Response) => {
    try {
      if (!InputValidator.isValidInt(request.body.messageID)) {
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const messageID = parseInt(request.body.messageID, 10);

      await this.messageDataAccess.deleteMessage(userID, messageID);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
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
        throw new InvalidParameterException("Invalid parameter");
      }

      const userID = parseInt(request.userID, 10);
      const receiverID = parseInt(request.body.receiverID, 10);
      const subject = InputValidator.sanitizeString(request.body.subject);
      const messageText = InputValidator.sanitizeString(request.body.body);

      const receiver = await this.userDataAccess.getUserById(receiverID);

      if (!InputValidator.isSet(receiver)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The receiver does not exist",
        });
      }

      await this.messageDataAccess.sendMessage(userID, receiverID, subject, messageText);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      if (error instanceof Exception) {
        return response.status(error.statusCode).json({
          error: error.message,
        });
      }

      this.logger.error(error.message, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request",
      });
    }
  };
}
