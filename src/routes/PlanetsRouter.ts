import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"

const db = new DB();
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

    /***
     * Returns the data of any planet the player owns given the planetID
     * @param request
     * @param response
     * @param next
     */
    public getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }

        let query : string = "SELECT * FROM `planets` WHERE `planetID` = :planetID AND `ownerID` = :ownerID;";

        db.getConnection().query(query,
            {
                replacements: {
                    ownerID: request.userID,
                    planetID: request.params.planetID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(planet => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: planet
            });

        });

    }

    /***
     * Returns the data of any planet given the planetID
     * @param request
     * @param response
     * @param next
     */
    public getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }

        let query : string = "SELECT `planetID`, `ownerID`, `name`, `galaxy`, `system`, `planet`, `last_update`, `planet_type`, `image`, `destroyed` FROM `planets` WHERE `planetID` = :planetID;";

        db.getConnection().query(query,
            {
                replacements: {
                    planetID: request.params.planetID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(planet => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: planet
            });

        });
    }

    /***
     * Initializes the routes
     */
    init() {

        // /user/planets/:planetID (getOwnPlanet)
        // is handled in the PlayersRouter.ts file

        // /planets/:planetID
        this.router.get('/:planetID', this.getPlanetByID);
    }

}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
