import {Router, Request, Response, NextFunction} from 'express';
import { Database } from '../common/Database';
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"
import {Globals} from "../common/Globals";
import { InvalidParameter } from "../common/Exceptions";


const squel = require("squel");

export class DefenseRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }


    public getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(!InputValidator.isSet(request.params.planetID) ||
            !InputValidator.isValidInt(request.params.planetID)) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        let query : string = squel.select()
                                .field("p.ownerID", "ownerID")
                                .field("d.*")
                                .from("defenses", "d")
                                .left_join("planets", "p", "d.planetID = p.planetID")
                                .where("d.planetID = ?", request.params.planetID)
                                .toString();

        Database.query(query).then(result => {

            let data;

            if(!InputValidator.isSet(result) || parseInt(result[0].ownerID) !== parseInt(request.userID)) {
                data = {};
            } else {
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

    public buildDefense(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        // planetID
        // JSON-array with defense-ID => amount

        if(!InputValidator.isSet(request.body.planetID) ||
            !InputValidator.isValidInt(request.body.planetID) ||
            !InputValidator.isSet(request.body.buildOrder) ||
            !InputValidator.isValidJson(request.body.buildOrder)) {
            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });
            return;
        }

        const buildOrders = JSON.parse(request.body.buildOrder);

        // validate build-order
        for(let order in buildOrders) {

            console.log(order + " => " + buildOrders[order])

            if(!InputValidator.isValidInt(order) ||
                !InputValidator.isValidInt(buildOrders[order]) ||
                parseInt(order) < Globals.MIN_DEFENSE_ID ||
                parseInt(order) > Globals.MAX_DEFENSE_ID ||
                buildOrders[order] < 0) {
                response.json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Invalid parameter",
                    data: {}
                });
                return;
            }
        }


        let query : string = squel.select()
            .field("metal")
            .field("crystal")
            .field("deuterium")
            .from("planets", "p")
            .where("p.planetID = ?", request.body.planetID)
            .toString();

        Database.query(query).then(result => {

            const metal = result[0].metal;
            const crystal = result[0].crystal;
            const deuterium = result[0].deuterium;


            // TODO: if it is a rocket, check if silo has enough free space

        }).catch(error => {
            Logger.error(error);

            response.json({
                status: Globals.Statuscode.SERVER_ERROR,
                message: "There was an error while handling the request.",
                data: {}
            });

            return;
        });


        response.json({
            status: Globals.Statuscode.SUCCESS,
            message: "Success",
            data: {}
        });

        return;

    }


    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/:planetID', this.getAllDefensesOnPlanet);
        this.router.post('/build/', this.buildDefense);
        // this.router.get('/get/:planetID/:buildingID', this.getBuildingById);
    }

}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
