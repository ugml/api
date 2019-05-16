import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";
const Logger = require('../common/Logger');

const squel = require("squel");

export class GalaxyRouter {
    router: Router;

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
    public getGalaxyInformation(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        console.log(request.params.galaxy);
        console.log(request.params.system);

        // validate parameters
        if(!InputValidator.isSet(request.params.galaxy) ||
            !InputValidator.isValidInt(request.params.galaxy) ||
            !InputValidator.isSet(request.params.system) ||
            !InputValidator.isValidInt(request.params.system)) {

            response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;

        }

        let query : string = squel.select()
            .field("p.planetID")
            .field("p.ownerID")
            .field("u.username")
            .field("p.name")
            .field("p.galaxy")
            .field("p.`system`")
            .field("p.planet")
            .field("p.last_update")
            .field("p.planet_type")
            .field("p.image")
            .field("g.debris_metal")
            .field("g.debris_crystal")
            .field("p.destroyed")
            .from("planets", "p")
            .left_join("galaxy", "g", "g.planetID = p.planetID")
            .left_join("users", "u", "u.userID = p.ownerID")
            .where("galaxy = ?", request.params.galaxy)
            .where("`system` = ?", request.params.system)
            .toString();

        console.log(query);

        // execute the query
        Database.query(query).then(result => {

            let data;

            if(!InputValidator.isSet(result)) {
                data = {};
            } else {
                data = Object.assign({}, result);
            }

            // return the result
            response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Success",
                data: data
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

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {

        this.router.get('/:galaxy/:system', this.getGalaxyInformation);
    }

}

const galaxyRouter = new GalaxyRouter();
galaxyRouter.init();

export default galaxyRouter.router;
