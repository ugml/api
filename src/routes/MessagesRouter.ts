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

import Message from "../units/Message";
import ErrorHandler from "../common/ErrorHandler";

@Route("messages")
@Tags("Messages")
// eslint-disable-next-line @typescript-eslint/no-use-before-define
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
      return await this.messageService.getAll(headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
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
      return await this.messageService.getById(messageID, headers.user.userID);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
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

      await this.messageService.send(request, headers.user.userID);

      return successResponse(Globals.StatusCodes.SUCCESS);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
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
      await this.messageService.delete(headers.user.userID, request.messageID);

      return successResponse(Globals.StatusCodes.SUCCESS);
    } catch (error) {
      return ErrorHandler.handle(error, badRequestResponse, unauthorizedResponse, serverErrorResponse);
    }
  }
}
