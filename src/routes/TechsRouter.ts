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


    public getTechs(request: IAuthorizedRequest, response: Response, next: NextFunction) {

        if(validator.isSet(request.params.playerID) &&
            validator.isValidInt(request.params.playerID)) {

            let query : string = "SELECT * FROM techs WHERE userID =  '" + request.params.playerID + "';";

            // execute the query
            db.getConnection().query(query, function (err, result, fields) {

                let data;

                if(!validator.isSet(result) || parseInt(result[0].userID) !== parseInt(request.userID)) {
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
        this.router.get('/get/:playerID', this.getTechs);
    }

}

const techsRouter = new TechsRouter();
techsRouter.init();

export default techsRouter.router;
