import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"

const squel = require("squel");

export class ShipsRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public getAllShipsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

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
                                .field("p.ownerID")
                                .field("f.*")
                                .from("fleet", "f")
                                .left_join("planets", "p", "f.planetID = p.planetID")
                                .where("f.planetID = ?", request.params.planetID)
                                .toString();

        // execute the query
        Database.getConnection().query(query, function (err, result) {

            let data;

            if(!InputValidator.isSet(result) || parseInt(result[0].ownerID) !== parseInt(request.userID)) {
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

        });
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
