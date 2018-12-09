import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"

const db = new DB();
const validator = new Validator();

export class ShipsRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    /***
     * Gets all ships on a given planet
     * @param request
     * @param response
     * @param next
     */
    public getAllShipsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
        }

        let query : string = "SELECT p.ownerID, f.* FROM fleet f LEFT JOIN planets p ON f.planetID = p.planetID WHERE f.planetID = :planetID;";

        db.getConnection().query(query,
            {
                replacements: {
                    planetID: request.params.planetID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(ships => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: ships
            });

        });
    }

    /***
     * Initializes the routes
     */
    init() {
        this.router.get('/:planetID', this.getAllShipsOnPlanet);
    }

}

const shipsRoutes = new ShipsRouter();
shipsRoutes.init();

export default shipsRoutes.router;
