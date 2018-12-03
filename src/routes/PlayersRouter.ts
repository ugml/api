import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"



const db = new DB();
const validator = new Validator();

export class PlayersRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET player by ID
     */
    public getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(validator.isSet(request.params.playerID) && validator.isValidInt(request.params.playerID)) {

            let query : string = "";

            // check, if user wants data from himself
            if(parseInt(request.params.playerID) === parseInt(request.userID)) {
                query = "SELECT DISTINCT `userID`, `username`, `onlinetime`, `currentplanet` FROM `users` WHERE `userID` = '" + request.params.playerID + "'";
            } else {
                query = "SELECT DISTINCT `userID`, `username` FROM `users` WHERE `userID` = '" + request.params.playerID + "'";
            }

            // execute the query
            db.getConnection().query(query, function (err, result, fields) {

                let data;

                if(!validator.isSet(result)) {
                    data = {};
                } else {
                    data = result[0];
                }

                // return the result
                response.json({
                    status: 200,
                    message: "Success",
                    data: data
                });
            });


        } else {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }
    }

    public createPlayer(request: Request, response: Response, next: NextFunction) {

        if(validator.isSet(request.query.username) && validator.isSet(request.query.password) && validator.isSet(request.query.email)) {
            // TODO: send user-create event to kafka
            response.json({
                status: 200,
                message: "Success",
                data: {}
            });
        } else {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/create/', this.createPlayer);
        this.router.get('/get/:playerID', this.getPlayerByID);
    }

}

const playerRoutes = new PlayersRouter();
playerRoutes.init();

export default playerRoutes.router;
