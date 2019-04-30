import { Router, Request, Response, NextFunction } from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import { PlanetsRouter } from "./PlanetsRouter";
import { Globals } from "../common/Globals";
const Logger = require('../common/Logger');


import squel = require("squel");
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

    public async createPlayer(request: Request, response: Response, next: NextFunction) {

        if (!InputValidator.isSet(request.query.username) ||
            !InputValidator.isSet(request.query.password) ||
            !InputValidator.isSet(request.query.email)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const gameConfig = require("../config/game.json");

        const username: string = InputValidator.sanitizeString(request.query.username);
        const password: string = InputValidator.sanitizeString(request.query.password);
        const email: string = InputValidator.sanitizeString(request.query.email);


        const hashedPassword = bcrypt.hashSync(password, 10);

        // check, if the username or the email is already taken
        let query = `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
                            `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

        Database.getConnection().beginTransaction(() => {

            Database.query(query).then(rows => {

                if(rows[0].username_taken == 1) {
                    throw new Error('Username is already taken');
                }

                if(rows[0].email_taken == 1) {
                    throw new Error('Email is already taken');
                }

            }).then(() => {

                Logger.info('Getting a new userID');

                let query = 'CALL getNewUserId();';

                return Database.query(query).then(row => {
                    let userID = row[0][0].userID;

                    return {userID: userID, planetID: -1, posGalaxy: -1, posSystem: -1, posPlanet: -1};
                });

            }).then(data => {

                Logger.info('Getting a new planetID');

                let query = 'CALL getNewPlanetId();';

                return Database.query(query).then(row => {
                    data.planetID = row[0][0].planetID;

                    return data;
                });

            }).then(data => {

                Logger.info('Finding free position for new planet');

                // getFreePosition(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
                let query = `CALL getFreePosition(${gameConfig.pos_galaxy_max}, ${gameConfig.pos_system_max}, 4, 12);`;

                return Database.query(query).then(row => {
                    data.posGalaxy = row[0][0].posGalaxy;
                    data.posSystem = row[0][0].posSystem;
                    data.posPlanet = row[0][0].posPlanet;

                    return data;
                });

            }).then(data => {

                Logger.info('Creating a new user');

                query = `INSERT INTO ugamela.users (\`userID\`, \`username\`, \`password\`, \`email\`, \`onlinetime\`, \`currentplanet\`) VALUES ('${data.userID}',  '${username}', '${hashedPassword}', '${email}', '0', '${data.planetID}');`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating a new planet');

                // TODO: relocate this code to a planet-class

                let name : string = gameConfig.startplanet_name;
                let updateTime : number = Date.now()/1000|0;
                let diameter : number = gameConfig.startplanet_diameter;
                let fieldsMax : number = gameConfig.startplanet_maxfields;
                let metal : number = gameConfig.metal_start;
                let crystal : number = gameConfig.crystal_start;
                let deuterium : number = gameConfig.deuterium_start;

                let image : string;

                let galaxy : number = data.posGalaxy;
                let system : number = data.posSystem;
                let planet : number = data.posPlanet;

                let tempMin : number;
                let tempMax : number;

                switch (true) {
                    case planet <= 5: {
                        tempMin = Math.random() * (130 - 40) + 40;
                        tempMax = Math.random() * (150 - 240) + 240;

                        let images: Array<string> = ['desert', 'dry'];

                        image = images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }
                    case planet <= 10: {
                        tempMin = Math.random() * (130 - 40) + 40;
                        tempMax = Math.random() * (150 - 240) + 240;

                        let images : Array<string> = ['normal', 'jungle', 'gas'];

                        image = images[Math.floor(Math.random()*images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }
                    case planet <= 15: {
                        tempMin = Math.random() * (130 - 40) + 40;
                        tempMax = Math.random() * (150 - 240) + 240;

                        let images : Array<string> = ['ice', 'water'];

                        image = images[Math.floor(Math.random()*images.length)] + Math.round(Math.random() * (10 - 1) + 1) + '.png';

                        break;
                    }

                }

                query = `INSERT INTO planets (\`planetID\`, \`ownerID\`, \`name\`, \`galaxy\`, \`system\`, \`planet\`, \`last_update\`, \`planet_type\`, \`image\`, \`diameter\`, \`fields_current\`, \`fields_max\`, \`temp_min\`, \`temp_max\`, \`metal\`, \`crystal\`, \`deuterium\`, \`energy_used\`, \`energy_max\`, \`metal_mine_percent\`, \`crystal_mine_percent\`, \`deuterium_synthesizer_percent\`, \`solar_plant_percent\`, \`fusion_reactor_percent\`, \`solar_satellite_percent\`, \`b_building_id\`, \`b_building_endtime\`, \`b_tech_id\`, \`b_tech_endtime\`, \`b_hangar_id\`, \`b_hangar_start_time\`, \`b_hangar_plus\`, \`destroyed\`) VALUES `
                    + `(${data.planetID}, ${data.userID}, '${name}', ${galaxy}, ${system}, ${planet}, ${updateTime}, 1, '${image}', ${diameter}, 0, ${fieldsMax}, ${tempMin}, ${tempMax}, ${metal}, ${crystal}, ${deuterium}, 0, 0, 100, 100, 100, 100, 100, 100, null, null, null, null, null, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });


            }).then(data => {
                Logger.info('Creating entry in buildings-table');

                query = `INSERT INTO buildings (\`planetID\`, \`metal_mine\`, \`crystal_mine\`, \`deuterium_synthesizer\`, \`solar_plant\`, \`fusion_reactor\`, \`robotic_factory\`, \`nanite_factory\`, \`shipyard\`, \`metal_storage\`, \`crystal_storage\`, \`deuterium_storage\`, \`research_lab\`, \`terraformer\`, \`alliance_depot\`, \`missile_silo\`) VALUES (${data.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in defenses-table');

                query = `INSERT INTO defenses (\`planetID\`, \`rocket_launcher\`, \`light_laser\`, \`heavy_laser\`, \`ion_cannon\`, \`gauss_cannon\`, \`plasma_turret\`, \`small_shield_dome\`, \`large_shield_dome\`, \`anti_ballistic_missile\`, \`interplanetary_missile\`) VALUES (${data.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in defenses-table');

                query = `INSERT INTO fleet (\`planetID\`, \`small_cargo_ship\`, \`large_cargo_ship\`, \`light_fighter\`, \`heavy_fighter\`, \`cruiser\`, \`battleship\`, \`colony_ship\`, \`recycler\`, \`espionage_probe\`, \`bomber\`, \`solar_satellite\`, \`destroyer\`, \`battlecruiser\`, \`deathstar\`) VALUES (${data.planetID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in galaxy-table');

                query = `INSERT INTO galaxy (\`planetID\`, \`debris_metal\`, \`debris_crystal\`) VALUES (${data.planetID}, 0, 0);`;

                return Database.query(query).then(() => {
                    return data;
                });

            }).then(data => {
                Logger.info('Creating entry in techs-table');

                query = `INSERT INTO techs (\`userID\`, \`espionage_tech\`, \`computer_tech\`, \`weapon_tech\`, \`armour_tech\`, \`shielding_tech\`, \`energy_tech\`, \`hyperspace_tech\`, \`combustion_drive_tech\`, \`impulse_drive_tech\`, \`hyperspace_drive_tech\`, \`laser_tech\`, \`ion_tech\`, \`plasma_tech\`, \`intergalactic_research_tech\`, \`graviton_tech\`) VALUES (${data.userID}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);`;

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

                // return the result
                response.json({
                    status: Globals.Statuscode.SERVER_ERROR,
                    message: "There was an error while handling the request.",
                    data: {}
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
