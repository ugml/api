import { Router, Request, Response, NextFunction } from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { PlanetsRouter } from "./PlanetsRouter";
import { Globals } from "../common/Globals";


import squel = require("squel");

export class PlayersRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    // TODO test

    public getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        let playerId = parseInt(request.userID);

        let query: string = squel.select()
            .field("userID")
            .field("username")
            .field("email")
            .field("onlinetime")
            .field("currentplanet")
            .from("users")
            .where("userID = ?", playerId)
            .toString();

        // execute the query
        Database.getConnection().query(query, function (error, result, fields) {

            if (error) throw error;

            let data: {};

            if (InputValidator.isSet(result)) {
                data = result[0];
            }

            // return the result
            response.json({
                status: Globals.Statuscode.SUCCESS,
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
        if (!InputValidator.isSet(request.params.playerID) ||
            !InputValidator.isValidInt(request.params.playerID)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        const query: string = squel.select()
            .distinct()
            .field("userID")
            .field("username")
            .from("users")
            .where("userID = ?", request.params.playerID)
            .toString();

        // execute the query
        Database.getConnection().query(query, function (error, result, fields) {

            if (error) throw error;

            let data = {};

            if (InputValidator.isSet(result)) {
                data = result[0];
            }

            // return the result
            response.json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: data
            });
            return;
        });
    }

    public createPlayer(request: Request, response: Response, next: NextFunction) {

        if (!InputValidator.isSet(request.query.username) ||
            !InputValidator.isSet(request.query.password) ||
            !InputValidator.isSet(request.query.email)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const username: string = InputValidator.sanitizeString(request.query.username);
        const password: string = InputValidator.sanitizeString(request.query.password);
        const email: string = InputValidator.sanitizeString(request.query.email);

        // TODO: start transaction

        // create user
        const query = `CALL createUser ("${username}", "${password}", "${email}");`;

        console.log(query);

        try {
            Database.getConnection().beginTransaction(function (err) {

                if (err) { throw err; }

                Database.getConnection().query(query, function (error, results, fields) {
                    if (error) {
                        return Database.getConnection().rollback(function () {
                            throw error;
                        });
                    }

                    const userID = results[0];

                    response.json({
                        status: Globals.Statuscode.SUCCESS,
                        message: "Success",
                        data: { userID }
                    });


                });
            });
        } catch (e) {
            console.error(e);
        }


        // create planet with user as owner

        // create galaxy-entry




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

        // /user/currentplanet/set/:planetID
        this.router.get('/currentplanet/set/:planetID', new PlanetsRouter().setCurrentPlanet);

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
