import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";


const squel = require("squel");

export class DefenseRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

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
                                .field("p.ownerID", "ownerID")
                                .field("d.*")
                                .from("defenses", "d")
                                .left_join("planets", "p", "d.planetID = p.planetID")
                                .where("d.planetID = ?", request.params.planetID)
                                .toString();

        Database.query(query).then(result => {

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
        this.router.get('/:planetID', this.getAllDefensesOnPlanet);
        // this.router.get('/get/:planetID/:buildingID', this.getBuildingById);
    }

}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
