import { Request } from "express";

export default interface IAuthorizedRequest extends Request {
  userID: string;
}
