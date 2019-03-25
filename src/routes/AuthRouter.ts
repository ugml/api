import {Router, Request, Response, NextFunction} from 'express';

import { Database } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { JwtHelper } from "../common/JwtHelper";

const jwt = new JwtHelper();
const validator = new Validator();
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

        if(!validator.isSet(req.query['email'])) {

            console.log("AuthRouter.ts: 400");

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        const email : string = validator.sanitizeString(req.query['email']);

        const query : string = "SELECT `userID`, `email`, `password` FROM `users` WHERE `email` = :email;";

        Database.getConnection().query(query,
            {
                replacements: {
                    email: email
                },
                type: Database.getConnection().QueryTypes.SELECT
            }
        ).then(user => {

            if(!validator.isSet(user)) {
                response.json({
                    status: 401,
                    message: "Authentication failed",
                    data: {}
                });
            }

            bcrypt.compare(req.query['password'], user[0].password).then(function(isValidPassword) {

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
                        token: jwt.generateToken(user[0].userID)
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
