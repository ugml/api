import { NextFunction, Response, Router } from "express";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";

const Logger = require("../common/Logger");


import squel = require("squel");

const bcrypt = require("bcrypt");

export class MessagesRouter {
    public router: Router;

    /**
     * Initialize the Router
     */
    public constructor() {
        this.router = Router();
        this.init();
    }

    public getAllMessages(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        const query: string = squel.select()
            .from("messages")
            .field("messageID")
            .field("senderID")
            .field("receiverID")
            .field("sendtime")
            .field("type")
            .field("subject")
            .field("body")
            .where("receiverID = ?", request.userID)
            .where("deleted = ?", 0)
            .order("sendtime", false)
            .toString();

        // execute the query
        Database.query(query).then((result) => {

            let data;

            if (!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = Object.assign({}, result);
            }

            // return the result
            response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data,
            });
            return;
        }).catch((error) => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {},
            });

            return;
        });

    }

    public getMessageByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if (!InputValidator.isSet(request.params.messageID) ||
            !InputValidator.isValidInt(request.params.messageID)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {},
            });

            return;

        }

        const query: string = squel.select()
            .from("messages")
            .field("messageID")
            .field("senderID")
            .field("receiverID")
            .field("sendtime")
            .field("type")
            .field("subject")
            .field("body")
            .where("receiverID = ?", request.userID)
            .where("messageID = ?", request.params.messageID)
            .where("deleted = ?", 0)
            .toString();

        // execute the query
        Database.query(query).then((result) => {

            let data;

            if (!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = result[0];
            }

            // return the result
            response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data,
            });
            return;
        }).catch((error) => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {},
            });

            return;
        });

    }

    public deleteMessage(request: IAuthorizedRequest, response: Response, next: NextFunction) {


        if (!InputValidator.isSet(request.body.messageID) ||
            !InputValidator.isValidInt(request.body.messageID)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {},
            });

            return;

        }

        const query: string = squel
            .update()
            .table("messages")
            .set("deleted", 1)
            .where("messageID = ?", request.body.messageID)
            .where("receiverID = ?", request.userID)
            .toString();

        Database.query(query).then(() => {

            response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "The message was deleted.",
                data: {},
            });

            return;

        }).catch((error) => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {},
            });

            return;
        });



    }

    public sendMessage(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if (!InputValidator.isSet(request.body.receiverID) ||
            !InputValidator.isValidInt(request.body.receiverID) ||
            !InputValidator.isSet(request.body.subject) ||
            !InputValidator.isSet(request.body.body)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {},
            });

            return;

        }

        const query: string = squel.select()
            .from("users")
            .field("userID")
            .where("userID = ?", request.body.receiverID)
            .toString();

        Database.query(query).then((result) => {

            const numRows: number = Object.keys(result).length;

            if (numRows == 0) {
                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "The receiver does not exist.",
                    data: {},
                });
                return;
            }

            const query: string = squel.insert()
                .into("messages")
                .set("senderID", request.userID)
                .set("receiverID", result[0].userID)
                .set("sendtime", Math.floor(Date.now() / 1000))
                .set("type", 1)
                .set("subject", InputValidator.sanitizeString(request.body.subject))
                .set("body", InputValidator.sanitizeString(request.body.body))
                .toString();

            Database.query(query).then(() => {

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Message sent.",
                    data: {},
                });
                return;

            });

        }).catch((error) => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {},
            });

            return;
        });



    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    public init() {

        // /user/planet/:planetID
        this.router.get("/get", this.getAllMessages);

        // /user/planets/
        this.router.get("/get/:messageID", this.getMessageByID);

        // /user/currentplanet/set/:planetID
        this.router.post("/delete", this.deleteMessage);

        // /user/create/
        this.router.post("/send", this.sendMessage);
    }

}

const messagesRouter = new MessagesRouter();
messagesRouter.init();

export default messagesRouter.router;
