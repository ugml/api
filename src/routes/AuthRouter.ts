import {Router, Request, Response, NextFunction} from 'express';

import { Database } from '../common/Database';
import { JwtHelper } from "../common/JwtHelper";
import { InputValidator } from "../common/InputValidator";
import {Globals} from "../common/Globals";
const squel = require("squel");
const jwt = new JwtHelper();
const bcrypt = require('bcrypt');


export class AuthRouter {
    router: Router;


    constructor() {
        this.router = Router();
        this.init();
    }

    /***
     * Validates the passed login-data. If the data is valid,
     * a new JWT-token is returned.
     * @param req
     * @param response
     * @param next
     */
    public authenticate(req: Request, response: Response, next: NextFunction) {

        if(!InputValidator.isSet(req.query['email'])) {

            response.json({
                status: Globals.Statuscode.NOT_AUTHORIZED,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const email : string = InputValidator.sanitizeString(req.query['email']);

        const query : string = squel.select({ autoQuoteFieldNames: true })
                                    .field("userID")
                                    .field("email")
                                    .field("password")
                                    .from("users")
                                    .where("email = ?", email)
                                    .toString();

        Database.getConnection().query(query, function(error, users) {
            if (error) throw error;


            if(!InputValidator.isSet(users)) {
                response.json({
                    status: Globals.Statuscode.NOT_AUTHORIZED,
                    message: "Authentication failed",
                    data: {}
                });
                return;
            }

            bcrypt.compare(req.query['password'], users[0].password).then(function(isValidPassword) {

                if(!isValidPassword) {
                    response.json({
                        status: Globals.Statuscode.NOT_AUTHORIZED,
                        message: "Authentication failed",
                        data: {}
                    });
                    return;
                }


                response.json({
                    status: Globals.Statuscode.SUCCESS,
                    message: "Success",
                    data: {
                        token: jwt.generateToken(users[0].userID)
                    }
                });
                return;

            });
        });


    }

    /***
     * Initializes the routes
     */
    init() {
        this.router.post('/login', this.authenticate);
    }

}

const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
