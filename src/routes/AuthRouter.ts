import {Router, Request, Response, NextFunction} from 'express';

import { Database } from '../common/Database';
import { JwtHelper } from "../common/JwtHelper";
import { BaseRouter } from "./BaseRouter";

const jwt = new JwtHelper();
const bcrypt = require('bcrypt');


export class AuthRouter extends BaseRouter {
    router: Router;


    constructor() {
        super();
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

        if(!this.inputValidator.isSet(req.query['email'])) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const email : string = this.inputValidator.sanitizeString(req.query['email']);

        const query : string = this.squel.select({ autoQuoteFieldNames: true })
                                    .field("userID")
                                    .field("email")
                                    .field("password")
                                    .from("users")
                                    .where("email = ?", email)
                                    .toString();

        Database.getConnection().query(query, function(err, users) {
            if(!this.inputValidator.isSet(users)) {
                response.json({
                    status: 401,
                    message: "Authentication failed",
                    data: {}
                });
            }

            bcrypt.compare(req.query['password'], users[0].password).then(function(isValidPassword) {

                if(!isValidPassword) {
                    response.json({
                        status: 401,
                        message: "Authentication failed",
                        data: {}
                    });
                }


                return response.json({
                    status: 200,
                    message: "Success",
                    data: {
                        token: jwt.generateToken(users[0].userID)
                    }
                });

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
