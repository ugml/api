import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";
import {Config} from "../common/Config";
import {Units} from "../common/Units";


const Logger = require('../common/Logger');


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


        let query : string = squel.select()
                                .from("techs")
                                .where("userID = ?", request.userID)
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

    private static getCosts(buildingKey : string, currentLevel : number) : object {

        let costs = units.getTechnologies()[buildingKey];

        return {
            "metal": costs["metal"] * costs["factor"] ** currentLevel,
            "crystal": costs["crystal"] * costs["factor"] ** currentLevel,
            "deuterium": costs["deuterium"] * costs["factor"] ** currentLevel,
            "energy": costs["energy"] * costs["factor"] ** currentLevel,
        };

    }

    public cancelTech(request: IAuthorizedRequest, response: Response, next: NextFunction) {


        if(!InputValidator.isSet(request.body.planetID) ||
            !InputValidator.isValidInt(request.body.planetID)) {

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
            .join("techs", "t", "t.userID = p.ownerID")
            .where("p.planetID = ?", request.body.planetID)
            .where("p.ownerID = ?", request.userID)
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
            if(planet.b_tech_id !== 0 || planet.b_tech_endtime !== 0) {

                const buildingKey = units.getMappings()[planet.b_tech_id];

                // give back the ressources
                const currentLevel = planet[buildingKey];

                const cost = TechsRouter.getCosts(planet.b_tech_id, currentLevel);

                const query: string = squel.update()
                    .table("planets")
                    .set("b_tech_id", 0)
                    .set("b_tech_endtime", 0)
                    .set("metal", planet.metal + cost["metal"])
                    .set("crystal", planet.crystal + cost["crystal"])
                    .set("deuterium", planet.deuterium + cost["deuterium"])
                    .where("planetID = ?", planet.planetID)
                    .where("ownerID = ?", request.userID)
                    .toString();


                return Database.query(query).then(result => {

                    planet.b_tech_id = 0;
                    planet.b_tech_endtime = 0;
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

    public buildTech(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!InputValidator.isSet(request.body.planetID) ||
            !InputValidator.isValidInt(request.body.planetID) ||
            !InputValidator.isSet(request.body.techID) ||
            !InputValidator.isValidInt(request.body.techID)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });
            return;

        }

        if(request.body.techID < Globals.MIN_TECH_ID ||
            request.body.techID > Globals.MAX_TECH_ID) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        // get the planet, on which the building should be built
        let query: string = squel.select()
            .from("planets", "p")
            .left_join("buildings", "b", "b.planetID = p.planetID")
            .left_join("techs", "t", "t.userID = p.ownerID")
            .where("p.planetID = ?", request.body.planetID)
            .where("p.ownerID = ?", request.userID)
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
            if(planet.b_tech_id !== 0 ||
                planet.b_tech_endtime !== 0) {
                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Planet already has a build-job",
                    data: {}
                });
                return;
            }

            // can't build research lab while they are researching... poor scientists :(
            // if(request.body.techID == Globals.Buildings.RESEARCH_LAB &&
            //     (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)) {
            //
            //     response.status(Globals.Statuscode.SUCCESS).json({
            //         status: Globals.Statuscode.SUCCESS,
            //         message: "Can't build this building while it is in use",
            //         data: {}
            //     });
            //
            //     return;
            // }


            // 2. check, if requirements are met
            let requirements = units.getRequirements()[request.body.techID];

            // building has requirements
            if(requirements !== undefined) {

                let requirementsMet : boolean = true;

                for(var reqID in requirements)
                {

                    let reqLevel = requirements[reqID];
                    let key = units.getMappings()[reqID];

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
            let buildingKey = units.getMappings()[request.body.techID];

            let currentLevel = planet[buildingKey];


            let cost = TechsRouter.getCosts(request.body.techID, currentLevel);


            if(planet.metal < cost["metal"] ||
                planet.crystal < cost["crystal"] ||
                planet.deuterium < cost["deuterium"] ||
                planet.energy_max < cost["energy"]) {

                response.status(Globals.Statuscode.SUCCESS).json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Not enough resources",
                    data: {}
                });
                return;

            }

            // 4. start the build-job
            let buildTime = Math.round((cost["metal"] + cost["crystal"]) / (Config.Get["speed"] * 1000 * result[0].research_lab));

            let endTime = Math.round(+new Date()/1000) + buildTime;

            planet.metal = planet.metal - cost['metal'];
            planet.crystal = planet.crystal - cost['crystal'];
            planet.deuterium = planet.deuterium - cost['deuterium'];
            planet.b_tech_id = request.body.techID;
            planet.b_tech_endtime = endTime;


            let query : string = squel.update()
                .table("planets")
                .set("metal", planet.metal)
                .set("crystal", planet.crystal)
                .set("deuterium", planet.deuterium)
                .set("b_tech_id", planet.b_tech_id)
                .set("b_tech_endtime", planet.b_tech_endtime)
                .where("planetID = ?", request.body.planetID)
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
        this.router.get('/', this.getTechs);
        this.router.post('/build/', this.buildTech);
        this.router.post('/cancel/', this.cancelTech);
    }

}

const techsRouter = new TechsRouter();
techsRouter.init();

export default techsRouter.router;
