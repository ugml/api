import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"


const db = new DB();
const validator = new Validator();

export class DefenseRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(validator.isSet(request.params.planetID) &&
            validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT p.ownerID AS ownerID, d.* FROM defenses d LEFT JOIN planets p ON d.planetID = p.planetID WHERE d.planetID = '" + request.params.planetID + "';";

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
        this.router.get('/:planetID', this.getAllDefensesOnPlanet);
        // this.router.get('/get/:planetID/:buildingID', this.getBuildingById);
    }

}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
