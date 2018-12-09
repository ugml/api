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

    /**
     * Returns all buildings on a given planet
     * @param request
     * @param response
     * @param next
     */
    public getAllBuildingsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        let query : string = "SELECT p.ownerID, b.* FROM buildings b LEFT JOIN planets p ON b.planetID = p.planetID WHERE b.planetID = :planetID;";

        db.getConnection().query(query,
            {
                replacements: {
                    planetID: request.params.planetID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(buildings => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: buildings
            });

        });
    }

    /***
     * Initializes the routes
     */
    init() {
        this.router.get('/:planetID', this.getAllBuildingsOnPlanet);
    }

}

const buildingRoutes = new BuildingsRouter();
buildingRoutes.init();

export default buildingRoutes.router;
