import {Router, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Units} from "../common/Units";
import {Config} from "../common/Config";


const squel = require("squel");

const units = new Units();

export class BuildingsRouter {
    router: Router;

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

        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        const query : string = squel.select()
                                    .field("p.ownerID")
                                    .field("b.*")
                                    .from("buildings", "b")
                                    .left_join("planets", "p", "b.planetID = p.planetID")
                                    .where("b.planetID = ?", request.params.planetID)
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
                status: 200,
                message: "Success",
                data: data
            });

            return;

        });
    }

    public cancelBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {
        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID) ||
            !InputValidator.isSet(request.params.buildingID) ||
            !InputValidator.isValidInt(request.params.buildingID)) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        if(request.params.buildingID < Globals.MIN_BUILDING_ID ||
            request.params.buildingID > Globals.MAX_BUILDING_ID) {
            response.json({

                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }


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

        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID) ||
            !InputValidator.isSet(request.params.buildingID) ||
            !InputValidator.isValidInt(request.params.buildingID)) {
            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        if(request.params.buildingID < Globals.MIN_BUILDING_ID ||
            request.params.buildingID > Globals.MAX_BUILDING_ID) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        // get the planet, on which the building should be built
        let query: string = squel.select()
                            .from("planets", "p")
                            .join("buildings", "b", "p.planetID = b.planetID")
                            .where("p.planetID = ?", request.params.planetID)
                            .toString();


        Database.getConnection().query(query, function (err, result) {

            if(!InputValidator.isSet(result)) {
                response.json({
                    status: 400,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            let planet = result[0];

            // player does not own the planet
            if(!InputValidator.isSet(planet)) {
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
            if((request.params.buildingID == Globals.Buildings.ROBOTIC_FACTORY ||
                request.params.buildingID == Globals.Buildings.NANITE_FACTORY ||
                request.params.buildingID == Globals.Buildings.SHIPYARD
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
            if(request.params.buildingID == Globals.Buildings.RESEARCH_LAB &&
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


            let query : string = squel.update()
                                .table("planets")
                                .set("metal", planet.metal)
                                .set("crystal", planet.crystal)
                                .set("deuterium", planet.deuterium)
                                .set("b_building_id", planet.b_building_id)
                                .set("b_building_endtime", planet.b_building_endtime)
                                .where("planetID = ?", request.params.planetID)
                                .toString();

            Database.getConnection().query(query, function (err, result) {

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
