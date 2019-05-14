import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";
import {Config} from "../common/Config";
import {Units} from "../common/Units";


const squel = require("squel");
const units = new Units();

export class TechsRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    /**
     * Returns all technologies of a given user
     * @param request
     * @param response
     * @param next
     */
    public getTechs(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!InputValidator.isSet(request.params.playerID) ||
            !InputValidator.isValidInt(request.params.playerID)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let query : string = squel.select()
                                .from("techs")
                                .where("userID = ?", request.params.playerID)
                                .toString();

        Database.query(query).then(result => {

            // return the result
            response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: result
            });
            return;

        }).catch(error => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });
    }

    private getCosts(buildingKey : string, currentLevel : number) : object {

        let costs = units.getBuildings()[buildingKey];

        return {
            "metal": costs["metal"] * costs["factor"] ** currentLevel,
            "crystal": costs["crystal"] * costs["factor"] ** currentLevel,
            "deuterium": costs["deuterium"] * costs["factor"] ** currentLevel,
            "energy": costs["energy"] * costs["factor"] ** currentLevel,
        };

    }



    public cancelTech(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // TODO: make this a POST-request

        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });
            return;

        }


        // get the planet, on which the building should be canceled
        let query: string = squel.select()
            .from("planets", "p")
            .join("buildings", "b", "p.planetID = b.planetID")
            .where("p.planetID = ?", request.params.planetID)
            .toString();


        Database.query(query).then(result => {

            if(!InputValidator.isSet(result)) {
                response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            let planet = result[0];

            // player does not own the planet
            if(!InputValidator.isSet(planet)) {
                response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            // 1. check if there is already a build-job on the planet
            if(planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {

                const buildingKey = units.getMappings()[planet.b_building_id];

                // give back the ressources
                const currentLevel = planet[buildingKey];

                const cost = techsRouter.getCosts(buildingKey, currentLevel);

                const query: string = squel.update()
                    .table("planets")
                    .set("b_building_id", 0)
                    .set("b_building_endtime", 0)
                    .set("metal", planet.metal + cost["metal"])
                    .set("crystal", planet.crystal + cost["crystal"])
                    .set("deuterium", planet.deuterium + cost["deuterium"])
                    .where("planetID = ?", planet.planetID)
                    .toString();


                return Database.query(query).then(result => {

                    planet.b_building_id = 0;
                    planet.b_building_endtime = 0;
                    planet.metal = planet.metal + cost["metal"];
                    planet.crystal = planet.crystal + cost["crystal"];
                    planet.crystal = planet.crystal + cost["crystal"];

                    response.status(Globals.Statuscode.SUCCESS).json({
                        status: Globals.Statuscode.SUCCESS,
                        message: "Building canceled",
                        data: {planet}
                    });
                    return;
                }).catch(error => {
                    Logger.error(error);

                    response.status(Globals.Statuscode.SERVER_ERROR).json({
                        status: Globals.Statuscode.SERVER_ERROR,
                        message: "There was an error while handling the request.",
                        data: {}
                    });

                    return;
                });

            } else {
                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Planet has no build-job",
                    data: {}
                });
                return;
            }
        }).catch(error => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });


    }

    public startTech(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // TODO: make this a POST-request

        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID) ||
            !InputValidator.isSet(request.params.techID) ||
            !InputValidator.isValidInt(request.params.techID)) {
            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        if(request.params.techID < Globals.MIN_TECH_ID ||
            request.params.techID > Globals.MAX_TECH_ID) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        // get the planet, on which the building should be built
        let query: string = squel.select()
            .from("users", "u")
            .join("techs", "t", "p.ow = t.planetID")
            .where("p.planetID = ?", request.params.planetID)
            .toString();


        Database.query(query).then(result => {

            if(!InputValidator.isSet(result)) {
                response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            let planet = result[0];

            // player does not own the planet
            if(!InputValidator.isSet(planet)) {
                response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }

            // 1. check if there is already a build-job on the planet
            if(planet.b_building_id !== 0 ||
                planet.b_building_endtime !== 0) {
                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Planet already has a build-job",
                    data: {}
                });
                return;
            }

            // can't build shipyard / robotic / nanite while ships or defenses are built
            if((request.params.techID == Globals.Buildings.ROBOTIC_FACTORY ||
                    request.params.techID == Globals.Buildings.NANITE_FACTORY ||
                    request.params.techID == Globals.Buildings.SHIPYARD
                )
                &&
                (planet.b_hangar_id > 0 ||
                    planet.b_hangar_starttime > 0
                )) {

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Can't build this building while it is in use",
                    data: {}
                });

                return;
            }

            // can't build research lab while they are researching... poor scientists :(
            if(request.params.techID == Globals.Buildings.RESEARCH_LAB &&
                (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)) {

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Can't build this building while it is in use",
                    data: {}
                });

                return;
            }


            // 2. check, if requirements are met
            let requirements = units.getRequirements()[request.params.techID];

            // building has requirements
            if(requirements !== undefined) {

                let requirementsMet : boolean = true;

                for(var reqID in requirements)
                {

                    let reqLevel = requirements[reqID];
                    let key = units.getMappings()[request.params.techID];

                    if(planet[key] < reqLevel) {
                        requirementsMet = false;
                        break;
                    }
                }

                if(!requirementsMet) {
                    response.status(Globals.Statuscode.SUCCESS).json({
                        status: Globals.Statuscode.SUCCESS,
                        message: "Requirements are not met",
                        data: planet.planetID
                    });

                    return;
                }
            }

            // 3. check if there are enough resources on the planet for the building to be built
            let buildingKey = units.getMappings()[request.params.techID];
            let currentLevel = planet[buildingKey];
            let costs = units.getBuildings()[request.params.techID];


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

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
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
            planet.b_building_id = request.params.techID;
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

            Database.query(query).then(result => {

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Job started",
                    data: {planet}
                });

                return;

            }).catch(error => {
                throw error;
            });


        }).catch(error => {
            Logger.error(error);

            response.status(Globals.Statuscode.SERVER_ERROR).json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });

    }


    /***
     * Initializes the routes
     */
    init() {
        this.router.get('/:playerID', this.getTechs);
    }

}

const techsRouter = new TechsRouter();
techsRouter.init();

export default techsRouter.router;
