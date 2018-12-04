import {Router, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"

const db = new DB();
const validator = new Validator();

export class BuildingsRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public getAllBuildingsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(validator.isSet(request.params.planetID) &&
            validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT p.ownerID, b.* FROM buildings b LEFT JOIN planets p ON b.planetID = p.planetID WHERE b.planetID = '" + request.params.planetID + "';";

            // execute the query
            db.getConnection().query(query, function (err, result, fields) {

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
        this.router.get('/get/:planetID', this.getAllBuildingsOnPlanet);
    }

}

const buildingRoutes = new BuildingsRouter();
buildingRoutes.init();

export default buildingRoutes.router;
