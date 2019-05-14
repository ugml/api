import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";
const Logger = require('../common/Logger');

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

    public setCurrentPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // TODO: make this a POST request

        // validate parameters
        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        // check if user owns the planet
        let query : string = squel.select()
            .from("planets")
            .where("planetID = ?", request.params.planetID)
            .where("ownerID = ?", request.userID)
            .toString();

        return Database.query(query).then(result => {

            if(!InputValidator.isSet(result)) {

                response.json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "The player does not own the planet",
                    data: {}
                });

                return;
            }


            let query : string = squel.update()
                .table("users")
                .set("currentplanet = ?", request.params.planetID)
                .where("userID = ?", request.userID)
                .toString();


            return Database.query(query).then(result => {

                response.json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Success",
                    data: {}
                });

                return;
            }).catch(error => {
                throw error;
            });

        }).catch(error => {
            Logger.error(error);

            response.json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });

    }

    public getAllPlanetsOfPlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let query : string = squel.select()
            .from("planets")
            .where("ownerID = ?", request.userID)
            .toString();

        // execute the query
        Database.query(query).then(result => {

            let data;

            if(!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = result;
            }

            // return the result
            response.json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: data
            });
            return;

        }).catch(error => {
            Logger.error(error);

            response.json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });
    }

    public getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let query : string = squel.select()
                                .from("planets")
                                .where("planetID = ?", request.params.planetID)
                                .where("ownerID = ?", request.userID)
                                .toString();

        // execute the query
        Database.query(query).then(result => {

            let data;

            if(!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = result[0];
            }

            // return the result
            response.json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: data
            });
            return;

        }).catch(error => {
            Logger.error(error);

            response.json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
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
                status: Globals.Statuscode.NOT_AUTHORIZED,
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
                                .where("planetID = ?", request.params.planetID)
                                .toString();

        // execute the query
        Database.query(query).then(result => {

            let data;

            if(!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = result[0];
            }

            // return the result
            response.json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: data
            });
            return;

        }).catch(error => {
            Logger.error(error);

            response.json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
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
