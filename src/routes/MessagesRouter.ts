import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";

import IMessageService from "../interfaces/services/IMessageService";
import IUserService from "../interfaces/services/IUserService";
import ILogger from "../interfaces/ILogger";
import { Body, Controller, Get, Post, Request, Res, Route, Security, Tags, TsoaResponse } from "tsoa";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import SendMessageRequest from "../entities/requests/SendMessageRequest";
import DeleteMessageRequest from "../entities/requests/DeleteMessageRequest";
import { provide } from "inversify-binding-decorators";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";

import Message from "../units/Message";

@Route("messages")
@Tags("Messages")
@provide(MessagesRouter)
export class MessagesRouter extends Controller {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IMessageService) private messageService: IMessageService;

  @Get("/")
  @Security("jwt")
  public async getAllMessages(
    @Request() headers,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Message[]>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Message[]> {
    try {
      return await this.messageService.getAllMessages(headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Get("/{messageID}")
  @Security("jwt")
  public async getMessageByID(
    @Request() headers,
    messageID: number,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, Message>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<Message> {
    try {
      return await this.messageService.getMessageById(messageID, headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Post("/send")
  @Security("jwt")
  public async sendMessage(
    @Request() headers,
    @Body() request: SendMessageRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, void>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<void> {
    try {
      request.subject = InputValidator.sanitizeString(request.subject);
      request.body = InputValidator.sanitizeString(request.body);

      return await this.messageService.sendMessage(request, headers.user.userID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }

  @Post("/delete")
  @Security("jwt")
  public async deleteMessage(
    @Request() headers,
    @Body() request: DeleteMessageRequest,
    @Res() successResponse: TsoaResponse<Globals.StatusCodes.SUCCESS, void>,
    @Res() badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    @Res() unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    @Res() serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ): Promise<void> {
    try {
      return await this.messageService.deleteMessage(headers.user.userID, request.messageID);
    } catch (error) {
      if (error instanceof ApiException) {
        return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
      }

      if (error instanceof UnauthorizedException) {
        return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
      }

      this.logger.error(error, error.stack);

      return serverErrorResponse(
        Globals.StatusCodes.SERVER_ERROR,
        new FailureResponse("There was an error while handling the request."),
      );
    }
  }
}
