import {Router, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Units} from "../common/Units";
import {Config} from "../common/Config";


const validator = new Validator();

const units = new Units();

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

        if(validator.isSet(request.params.planetID) &&
            validator.isValidInt(request.params.planetID)) {

            const query : string = "SELECT p.ownerID, b.* FROM buildings b LEFT JOIN planets p ON b.planetID = p.planetID WHERE b.planetID = '${request.params.planetID}';";

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
                return;


            });



        } else {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        response.json({
            status: 500,
            message: "Server error",
            data: {}
        });
        return;
    }

    public startBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // task                                                 | object needed
        // -----------------------------------------------------|-------------------------------------------
        // 0. check, if planet already building a building      | current planet
        // 1. check if requirements met for building            | current buildings on planet & requirements
        // 2. check if enough ressources                        | current planet
        // 3. start building-process                            | current planet
        //    3.1. substract resources form planet              | current planet
        //    3.2. set b_building_id and b_building_endtime     | current planet

        if(!validator.isSet(request.params.planetID) ||
            !validator.isValidInt(request.params.planetID) ||
            !validator.isSet(request.params.buildingID) ||
            !validator.isValidInt(request.params.buildingID)) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        // TODO: define global values for min- and max-IDs for buildings
        if(request.params.buildingID < 1 || request.params.buildingID > 15) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        // get the planet, on which the building should be built
        let query: string = `SELECT * FROM planets p JOIN buildings b on p.planetID = b.planetID WHERE p.planetID = '${request.params.planetID}' AND p.ownerID = '${request.userID}';`;

        Database.getConnection().query(query, function (err, result, fields) {

            if(!validator.isSet(result)) {
                response.json({
                    status: 400,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            let planet = result[0];

            // player does not own the planet
            if(!validator.isSet(planet)) {
                response.json({
                    status: 400,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            // 1. check if there is already a build-job on the planet
            if(planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {
                response.json({
                    status: 200,
                    message: "Planet already has a build-job",
                    data: {}
                });
                return;
            }

            // can't build shipyard / robotic / nanite while ships or defenses are built
            if((request.params.buildingID == 6 ||
                    request.params.buildingID == 7 ||
                    request.params.buildingID == 8
                )
                &&
                (planet.b_hangar_id > 0 ||
                 planet.b_hangar_starttime > 0
                )) {

                response.json({
                    status: 200,
                    message: "Can't build this building while it is in use",
                    data: {}
                });

                return;
            }

            // can't build research lab while they are researching... poor scientists :(
            if(request.params.buildingID == 12 &&
                (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)) {

                response.json({
                    status: 200,
                    message: "Can't build this building while it is in use",
                    data: {}
                });

                return;
            }


            // 2. check, if requirements are met
            let requirements = units.getRequirements()[request.params.buildingID];

            // building has requirements
            if(requirements !== undefined) {

                let requirementsMet : boolean = true;

                for(var reqID in requirements)
                {

                    let reqLevel = requirements[reqID];
                    let key = units.getMappings()[request.params.buildingID];

                    if(planet[key] < reqLevel) {
                        requirementsMet = false;
                        break;
                    }
                }

                if(!requirementsMet) {
                    response.json({
                        status: 200,
                        message: "Requirements are not met",
                        data: planet.planetID
                    });

                    return;
                }
            }

            // 3. check if there are enough resources on the planet for the building to be built
            let buildingKey = units.getMappings()[request.params.buildingID];
            let currentLevel = planet[buildingKey];
            let costs = units.getBuildings()[request.params.buildingID];


            let cost = {
                "metal": costs["metal"] * costs["factor"] ** currentLevel,
                "crystal": costs["crystal"] * costs["factor"] ** currentLevel,
                "deuterium": costs["deuterium"] * costs["factor"] ** currentLevel,
                "energy": costs["energy"] * costs["factor"] ** currentLevel,
            };

            if(planet.metal < cost["metal"] ||
                planet.crystal < cost["crystal"] ||
                planet.deuterium < cost["deuterium"] ||
                planet.energy < cost["energy"]) {

                response.json({
                    status: 200,
                    message: "Not enough resources",
                    data: {}
                });
                return;

            }

            // 4. start the build-job
            let buildTime = Math.round((cost["metal"] + cost["crystal"]) / (2500 * (1 + planet["robotic_factory"]) * (2 ** planet["nanite_factory"]) * Config.Get["speed"]));

            let endTime = Math.round(+new Date()/1000) + buildTime;


            planet.metal = planet.metal - cost['metal'];
            planet.crystal = planet.crystal - cost['crystal'];
            planet.deuterium = planet.deuterium - cost['deuterium'];
            planet.b_building_id = request.params.buildingID;
            planet.b_building_endtime = endTime;


            let query: string = `UPDATE planets SET metal = ${planet.metal}, crystal = ${planet.crystal}, deuterium = ${planet.deuterium}, b_building_id = ${planet.b_building_id}, b_building_endtime = ${planet.b_building_endtime} WHERE planetID = ${request.params.planetID};`;

            Database.getConnection().query(query, function (err, result, fields) {

                if (err) throw err;

                response.json({
                    status: 200,
                    message: "Job started",
                    data: {planet}
                });
                return;

            });
        });

    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/:planetID', this.getAllBuildingsOnPlanet);

        this.router.get('/build/:planetID/:buildingID', this.startBuilding);
    }

}

const buildingRoutes = new BuildingsRouter();
buildingRoutes.init();

export default buildingRoutes.router;
