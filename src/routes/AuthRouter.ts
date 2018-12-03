import {Router, Request, Response, NextFunction} from 'express';

import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { JwtHelper } from "../common/JwtHelper";

const jwt = new JwtHelper();
const db = new DB();
const validator = new Validator();

const bcrypt = require('bcrypt');


export class AuthRouter {
    router: Router

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public authenticate(req: Request, response: Response, next: NextFunction) {


        if(validator.isSet(req.query['email'])) {
            let email = validator.sanitizeString(req.query['email']);

            let query : string = "SELECT DISTINCT `userID`, `email`, `password` FROM `users` WHERE `email` = '" + email + "'";


            db.getConnection().query(query, function (err, result, fields) {

                bcrypt.compare(req.query['password'], result[0].password).then(function(isValidPassword) {

                    if(validator.isSet(result) && isValidPassword) {
                        // create new jwt-token

                        return response.json({
                            status: 200,
                            message: "Success",
                            data: {
                                token: jwt.generateToken(result[0].userID)
                            }
                        });


                    } else {
                        // send fail-response

                        return response.json({
                            status: 401,
                            message: "Authentication failed",
                            data: {}
                        });
                    }
                });

            });
        }
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/login', this.authenticate);
    }

}

const authRoutes = new AuthRouter();
authRoutes.init();

export default authRoutes.router;
