import { Request } from "express";

export interface IAuthorizedRequest extends Request {
    userID: string;
}
