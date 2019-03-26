import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { PlanetsRouter } from "./PlanetsRouter";


const squel = require("squel");
const validator = new Validator();

export class PlayersRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        let playerId = parseInt(request.userID);

        let query : string = squel.select()
            .field("userID")
            .field("username")
            .field("onlinetime")
            .field("currentplanet")
            .from("users")
            .where("userID = ?", playerId)
            .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result, fields) {
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
            return;
        });

    }

    /**
     * GET player by ID
     */
    public getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!validator.isSet(request.params.playerID) ||
            !validator.isValidInt(request.params.playerID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        const query : string = squel.select()
                                .distinct()
                                .field("userID")
                                .field("username")
                                .from("users")
                                .where("userID = ?", request.params.playerID)
                                .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result, fields) {

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
            return;
        });
    }

    public createPlayer(request: Request, response: Response, next: NextFunction) {

        if(!validator.isSet(request.query.username) ||
            !validator.isSet(request.query.password) ||
            !validator.isSet(request.query.email)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        // TODO


        response.json({
            status: 200,
            message: "Success",
            data: {}
        });

        return;

    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {

        // /user/planet/:planetID
        this.router.get('/planet/:planetID', new PlanetsRouter().getOwnPlanet);

        // /user/planets/
        this.router.get('/planetlist/', new PlanetsRouter().getAllPlanetsOfPlayer);

        // /user/create/
        this.router.post('/create', this.createPlayer);

        // /user
        this.router.get('/', this.getPlayerSelf);

        // /users/:playerID
        this.router.get('/:playerID', this.getPlayerByID);
    }

}

const playerRoutes = new PlayersRouter();
playerRoutes.init();

export default playerRoutes.router;
