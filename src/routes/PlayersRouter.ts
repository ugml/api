import { Router, Request, Response, NextFunction } from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { PlanetsRouter } from "./PlanetsRouter";
import { Globals } from "../common/Globals";
import { DuplicateRecordError } from "../common/Exceptions";
const Logger = require('../common/Logger');


import squel = require("squel");
import {User} from "../units/User";
import {Planet} from "../units/Planet";
const bcrypt = require('bcrypt');

export class PlayersRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        let playerId = parseInt(request.userID);

        let query: string = squel.select()
            .field("userID")
            .field("username")
            .field("email")
            .field("onlinetime")
            .field("currentplanet")
            .from("users")
            .where("userID = ?", playerId)
            .toString();

        // execute the query
        Database.query(query).then( result => {

            let data: {};

            if (InputValidator.isSet(result)) {
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
     * GET player by ID
     */
    public getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // validate parameters
        if (!InputValidator.isSet(request.params.playerID) ||
            !InputValidator.isValidInt(request.params.playerID)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        const query: string = squel.select()
            .distinct()
            .field("userID")
            .field("username")
            .from("users")
            .where("userID = ?", request.params.playerID)
            .toString();

        // execute the query
        Database.query(query).then(result => {

            let data = {};

            if (InputValidator.isSet(result)) {
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

    public createPlayer(request: Request, response: Response, next: NextFunction) {

        if (!InputValidator.isSet(request.body.username) ||
            !InputValidator.isSet(request.body.password) ||
            !InputValidator.isSet(request.body.email)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const gameConfig = require("../config/game.json");

        const username: string = InputValidator.sanitizeString(request.body.username);
        const password: string = InputValidator.sanitizeString(request.body.password);
        const email: string = InputValidator.sanitizeString(request.body.email);


        const hashedPassword = bcrypt.hashSync(password, 10);

        // check, if the username or the email is already taken
        let query = `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
                            `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

        Database.getConnection().beginTransaction(() => {

            Database.query(query).then(rows => {

                if(rows[0].username_taken == 1) {
                    throw new DuplicateRecordError('Username is already taken');
                }

                if(rows[0].email_taken == 1) {
                    throw new DuplicateRecordError('Email is already taken');
                }

            }).then(() => {

                Logger.info('Getting a new userID');

                let query = 'CALL getNewUserId();';

                let newPlayer : User = new User();
                let newPlanet : Planet = new Planet();

                return Database.query(query).then(row => {
                    newPlayer.userID = row[0][0].userID;

                    return {player: newPlayer, planet: newPlanet};
                });

            }).then(data => {

                Logger.info('Getting a new planetID');

                let query = 'CALL getNewPlanetId();';

                return Database.query(query).then(row => {
                    data.player.currentplanet = row[0][0].planetID;
                    data.planet.planetID = row[0][0].planetID;

                    return data;
                });

            }).then(data => {

                Logger.info('Finding free position for new planet');

                // getFreePosition(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
                let query = `CALL getFreePosition(${gameConfig.pos_galaxy_max}, ${gameConfig.pos_system_max}, 4, 12);`;

                return Database.query(query).then(row => {
                    data.planet.galaxy = row[0][0].posGalaxy;
                    data.planet.system = row[0][0].posSystem;
                    data.planet.planet = row[0][0].posPlanet;

                    return data;
                });

            }).then(data => {

                Logger.info('Creating a new user');

                return data.player.save().then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating a new planet');

                // TODO: relocate this code to a planet-class

                data.planet.name = gameConfig.startplanet_name;
                data.planet.last_update = Date.now()/1000|0;
                data.planet.diameter = gameConfig.startplanet_diameter;
                data.planet.fields_max = gameConfig.startplanet_maxfields;
                data.planet.metal = gameConfig.metal_start;
                data.planet.crystal = gameConfig.crystal_start;
                data.planet.deuterium = gameConfig.deuterium_start;

                switch (true) {
                    case data.planet.planet <= 5: {
                        data.planet.temp_min = Math.random() * (130 - 40) + 40;
                        data.planet.temp_max = Math.random() * (150 - 240) + 240;

                        let images: Array<string> = ['desert', 'dry'];

                        data.planet.image = images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }
                    case data.planet.planet <= 10: {
                        data.planet.temp_min = Math.random() * (130 - 40) + 40;
                        data.planet.temp_max = Math.random() * (150 - 240) + 240;

                        let images : Array<string> = ['normal', 'jungle', 'gas'];

                        data.planet.image = images[Math.floor(Math.random()*images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }
                    case data.planet.planet <= 15: {
                        data.planet.temp_min = Math.random() * (130 - 40) + 40;
                        data.planet.temp_max = Math.random() * (150 - 240) + 240;

                        let images : Array<string> = ['ice', 'water'];

                        data.planet.image = images[Math.floor(Math.random()*images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }

                }

                return data.planet.save().then(() => {
                    return data;
                });


            }).then(data => {
                Logger.info('Creating entry in buildings-table');

                query = `INSERT INTO buildings (\`planetID\`, \`metal_mine\`, \`crystal_mine\`, \`deuterium_synthesizer\`, \`solar_plant\`, \`fusion_reactor\`, \`robotic_factory\`, \`nanite_factory\`, \`shipyard\`, \`metal_storage\`, \`crystal_storage\`, \`deuterium_storage\`, \`research_lab\`, \`terraformer\`, \`alliance_depot\`, \`missile_silo\`) VALUES (${data.planet.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in defenses-table');

                query = `INSERT INTO defenses (\`planetID\`, \`rocket_launcher\`, \`light_laser\`, \`heavy_laser\`, \`ion_cannon\`, \`gauss_cannon\`, \`plasma_turret\`, \`small_shield_dome\`, \`large_shield_dome\`, \`anti_ballistic_missile\`, \`interplanetary_missile\`) VALUES (${data.planet.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in defenses-table');

                query = `INSERT INTO fleet (\`planetID\`, \`small_cargo_ship\`, \`large_cargo_ship\`, \`light_fighter\`, \`heavy_fighter\`, \`cruiser\`, \`battleship\`, \`colony_ship\`, \`recycler\`, \`espionage_probe\`, \`bomber\`, \`solar_satellite\`, \`destroyer\`, \`battlecruiser\`, \`deathstar\`) VALUES (${data.planet.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in galaxy-table');

                query = `INSERT INTO galaxy (\`planetID\`, \`debris_metal\`, \`debris_crystal\`) VALUES (${data.planet.planetID}, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in techs-table');

                query = `INSERT INTO techs (\`userID\`, \`espionage_tech\`, \`computer_tech\`, \`weapon_tech\`, \`armour_tech\`, \`shielding_tech\`, \`energy_tech\`, \`hyperspace_tech\`, \`combustion_drive_tech\`, \`impulse_drive_tech\`, \`hyperspace_drive_tech\`, \`laser_tech\`, \`ion_tech\`, \`plasma_tech\`, \`intergalactic_research_tech\`, \`graviton_tech\`) VALUES (${data.player.userID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query);

            }).then(() => {

                Database.getConnection().commit(function(err) {
                    if (err) {
                        Database.getConnection().rollback(function () {
                            Logger.error(err);
                            throw err;
                        });
                    }
                });

                Logger.info('Transaction complete');

                // return the result
                response.json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Success",
                    data: {}
                });
                return;

            }).catch(err => {

                Logger.error(err);

                if (err) {
                    Database.getConnection().rollback();
                }

                Logger.info('Rolled back transaction');

                if(err instanceof DuplicateRecordError) {
                    // return the result
                    response.json({
                        status: Globals.Statuscode.SERVER_ERROR,
                        message: `There was an error while handling the request: ${err.message}`,
                        data: {}
                    });
                } else {
                    // return the result
                    response.json({
                        status: Globals.Statuscode.SERVER_ERROR,
                        message: "There was an error while handling the request.",
                        data: {}
                    });
                }



                return;
            });
        });


    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {

        // /user/planet/:planetID
        this.router.get('/planet/:planetID', new PlanetsRouter().getOwnPlanet);

        // /user/planets/
        this.router.get('/planetlist/', new PlanetsRouter().getAllPlanetsOfPlayer);

        // /user/currentplanet/set/:planetID
        this.router.get('/currentplanet/set/:planetID', new PlanetsRouter().setCurrentPlanet);

        // /user/create/
        this.router.post('/create', this.createPlayer);

        // /user
        this.router.get('/', this.getPlayerSelf);

        // /users/:playerID
        this.router.get('/:playerID', this.getPlayerByID);
    }

}

const playerRoutes = new PlayersRouter();
playerRoutes.init();

export default playerRoutes.router;
