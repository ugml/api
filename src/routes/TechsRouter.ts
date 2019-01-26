import {Router, Request, Response, NextFunction} from 'express';
import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest"


const db = new DB();
const validator = new Validator();

export class TechsRouter {
    router: Router

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

        if(!validator.isSet(request.params.playerID) ||
            !validator.isValidInt(request.params.playerID)) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let query : string = "SELECT * FROM techs WHERE userID =  :userID;";

        db.getConnection().query(query,
            {
                replacements: {
                    userID: request.params.playerID
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(techs => {

            // return the result
            response.json({
                status: 200,
                message: "Success",
                data: techs
            });

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
