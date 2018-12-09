import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { PlanetsRouter } from "./PlanetsRouter";



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

    /***
     * Returns the data of the currently logged in player
     * @param request
     * @param response
     * @param next
     */
    public getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let query = "SELECT DISTINCT `userID`, `username`, `onlinetime`, `currentplanet` FROM `users` WHERE `userID` = :userID;";

        db.getConnection().query(query,
            {
                replacements: {
                    userID: request.userID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(user => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: user
            });
        });

    }

    /***
     * Returns the data of any player given his userID
     * @param request
     * @param response
     * @param next
     */
    public getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!validator.isSet(request.params.playerID) || !validator.isValidInt(request.params.playerID)) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }

        let query : string = "SELECT DISTINCT `userID`, `username` FROM `users` WHERE `userID` = :userID;";

        db.getConnection().query(query,
            {
                replacements: {
                    userID: request.params.playerID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(user => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: user
            });

        });
    }

    /***
     * Passes a request to create a new user to kafka
     * @param request
     * @param response
     * @param next
     */
    public createPlayer(request: Request, response: Response, next: NextFunction) {

        if(!validator.isSet(request.query.username) ||
            !validator.isSet(request.query.password) ||
            !validator.isSet(request.query.email)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

        }

        // TODO: send user-create event to kafka
        response.json({
            status: 200,
            message: "Success",
            data: {}
        });

    }

    /***
     * Initializes the routes
     */
    init() {
        // /user/
        this.router.get('/', this.getPlayerSelf);

        // /users/:playerID
        this.router.get('/:playerID', this.getPlayerByID);

        // /user/planets/:planetID
        this.router.get('/planets/:planetID', new PlanetsRouter().getOwnPlanet);

        // /user/create/
        this.router.post('/create/', this.createPlayer);
    }

}

const playerRoutes = new PlayersRouter();
playerRoutes.init();

export default playerRoutes.router;
