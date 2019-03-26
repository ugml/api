import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"

const squel = require("squel");

export class PlanetsRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public getAllPlanetsOfPlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let query : string = squel.select()
            .from("planets")
            .where("ownerID", request.userID)
            .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result) {

            let data;

            if(!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = result;
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

    public getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let query : string = squel.select()
                                .from("planets")
                                .where("planetID + ?", request.params.planetID)
                                .where("ownerID = ?", request.userID)
                                .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result) {

            let data;

            if(!InputValidator.isSet(result)) {
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
     * GET planet by ID
     */
    public getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        let query : string = squel.select()
                                .field("planetID")
                                .field("ownerID")
                                .field("name")
                                .field("galaxy")
                                .field("system")
                                .field("planet")
                                .field("last_update")
                                .field("planet_type")
                                .field("image")
                                .field("destroyed")
                                .from("planets")
                                .where("planetID", request.params.planetID)
                                .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result) {

            let data;

            if(!InputValidator.isSet(result)) {
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
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {

        // /planets/:planetID
        this.router.get('/:planetID', this.getPlanetByID);
    }

}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
