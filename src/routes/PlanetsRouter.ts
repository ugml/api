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

    /**
     * GET planet by ID
     */
    public getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if(validator.isSet(request.params.planetID) && validator.isValidInt(request.params.planetID)) {

            let query : string = "SELECT DISTINCT * FROM `planets` WHERE `planetID` = '" + request.params.planetID + "'";

            // execute the query
            db.getConnection().query(query, function (err, result, fields) {

                let data;

                if(!validator.isSet(result)) {
                    data = {};
                } else {
                    data = result[0];
                }

                // check, if requesting user owns the planet, if not, hide some data
                if(parseInt(request.params.planetID) === parseInt(request.userID)) {
                    // hide sensitive data
                    delete data.diameter;
                    delete data.fields_current;
                    delete data.fields_max;
                    delete data.temp_min;
                    delete data.temp_max;
                    delete data.metal;
                    delete data.crystal;
                    delete data.deuterium;
                    delete data.energy_used;
                    delete data.energy_max;
                    delete data.metal_mine_percent;
                    delete data.crystal_mine_percent;
                    delete data.deuterium_synthesizer_percent;
                    delete data.solar_plant_percent;
                    delete data.fusion_reactor_percent;
                    delete data.solar_satellite_percent;
                    delete data.b_building_id;
                    delete data.b_building_endtime;
                    delete data.b_tech_id;
                    delete data.b_tech_endtime;
                    delete data.b_hangar_id;
                    delete data.b_hangar_start_time;
                    delete data.b_hangar_plus;
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
        this.router.get('/get/:planetID', this.getPlanetByID);
    }

}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
