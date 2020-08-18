import { TsoaResponse } from "tsoa";
import { Globals } from "../common/Globals";
import FailureResponse from "../entities/responses/FailureResponse";

export default interface IErrorHandler {
  handle(
    error: Error,
    badRequestResponse: TsoaResponse<Globals.StatusCodes.BAD_REQUEST, FailureResponse>,
    unauthorizedResponse: TsoaResponse<Globals.StatusCodes.NOT_AUTHORIZED, FailureResponse>,
    serverErrorResponse: TsoaResponse<Globals.StatusCodes.SERVER_ERROR, FailureResponse>,
  );
}
