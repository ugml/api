import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"


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


    public getAllShipsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(validator.isSet(request.params.planetID) &&
            validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT p.ownerID, f.* FROM fleet f LEFT JOIN planets p ON f.planetID = p.planetID WHERE f.planetID = '" + request.params.planetID + "';";

            // execute the query
            Database.getConnection().query(query, function (err, result, fields) {

                let data;

                if(!validator.isSet(result) || parseInt(result[0].ownerID) !== parseInt(request.userID)) {
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
        this.router.get('/:planetID', this.getAllShipsOnPlanet);
        // this.router.get('/get/:planetID/:buildingID', this.getBuildingById);
    }

}

const shipsRoutes = new ShipsRouter();
shipsRoutes.init();

export default shipsRoutes.router;
