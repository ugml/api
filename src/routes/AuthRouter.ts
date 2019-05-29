import {Router, Request, Response, NextFunction} from 'express';

import { DB } from '../common/db';
import { Validator } from "../common/ValidationTools";
import { JwtHelper } from "../common/JwtHelper";

const jwt = new JwtHelper();
const db = new DB();
const validator = new Validator();

const bcrypt = require('bcryptjs');


export class AuthRouter {
    router: Router

    /**
     * Initialize the Router
     */
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

        if(!validator.isSet(req.body['email'])) {

            response.json({
                status: 400,
                message: "Invalid parameter",
                data: {}
            });

            return;
        }

        let email = validator.sanitizeString(req.body['email']);

        let query : string = "SELECT `userID`, `email`, `password` FROM `users` WHERE `email` = :email;";

        db.getConnection().query(query,
            {
                replacements: {
                    email: email
                },
                type: db.getConnection().QueryTypes.SELECT
            }
        ).then(user => {

            bcrypt.compare(req.body['password'], user[0].password).then(function(isValidPassword) {

                if(!validator.isSet(user) || !isValidPassword) {
                    response.json({
                        status: 401,
                        message: "Authentication failed",
                        data: {}
                    });
                }

                // create new jwt-token
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
