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

    /**
     * Returns all defenses on a given planet
     * @param request
     * @param response
     * @param next
     */
    public getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID)) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let query : string = "SELECT p.ownerID, d.* FROM defenses d LEFT JOIN planets p ON d.planetID = p.planetID WHERE d.planetID = :planetID;";

        db.getConnection().query(query,
            {
                replacements: {
                    planetID: request.params.planetID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(defense => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: defense
            });

        });
    }

    /***
     * Initializes the routes
     */
    init() {
        this.router.get('/:planetID', this.getAllDefensesOnPlanet);
    }

}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
