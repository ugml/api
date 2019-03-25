import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"


const validator = new Validator();

export class PlanetsRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public getAllPlanetsOfPlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        let query : string = "SELECT * FROM `planets` WHERE `ownerID` = '" + request.userID + "';";

        // execute the query
        Database.getConnection().query(query, function (err, result, fields) {

            let data;

            if(!validator.isSet(result)) {
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
        });
    }

    public getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(validator.isSet(request.params.planetID) && validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT * FROM `planets` WHERE `planetID` = '" + request.params.planetID + "' AND `ownerID` = '" + request.userID + "';";

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
            });
        }

    }

    /**
     * GET planet by ID
     */
    public getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(validator.isSet(request.params.planetID) && validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT `planetID`, `ownerID`, `name`, `galaxy`, `system`, `planet`, `last_update`, `planet_type`, `image`, `destroyed` FROM `planets` WHERE `planetID` = '" + request.params.planetID + "'";

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

        // /planets/:planetID
        this.router.get('/:planetID', this.getPlanetByID);
    }

}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
