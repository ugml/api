import { TsoaResponse } from "tsoa";
import { Globals } from "./Globals";
import FailureResponse from "../entities/responses/FailureResponse";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import ILogger from "../interfaces/ILogger";
import IErrorHandler from "../interfaces/IErrorHandler";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import NonExistingEntityException from "../exceptions/NonExistingEntityException";

@injectable()
export default class ErrorHandler implements IErrorHandler {
  private logger: ILogger;

  constructor(@inject(TYPES.ILogger) logger: ILogger) {
    this.logger = logger;
  }

  public handle(
    error: Error,
    badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  ) {
    if (
      error instanceof ApiException ||
      error instanceof InvalidParameterException ||
      error instanceof NonExistingEntityException
    ) {
      return badRequestResponse(Globals.StatusCodes.BAD_REQUEST, new FailureResponse(error.message));
    }

    if (error instanceof UnauthorizedException) {
      return unauthorizedResponse(Globals.StatusCodes.NOT_AUTHORIZED, new FailureResponse(error.message));
    }

    this.logger.error(error.message, error.stack);

    return serverErrorResponse(
      Globals.StatusCodes.SERVER_ERROR,
      new FailureResponse("There was an error while handling the request."),
    );
  }
}
