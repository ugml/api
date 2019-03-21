import {Router, Response, NextFunction, Request} from 'express';

export class ConfigRouter {

    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    public getGameConfig(req: Request, response: Response, next: NextFunction) {

        const data = require("../config/game.json");

        response.json(data);
    }

    public getUnitsConfig(req: Request, response: Response, next: NextFunction) {

        const data = require("../config/units.json");

        response.json(data);
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/game', this.getGameConfig);
        this.router.get('/units', this.getUnitsConfig);
    }

}

const configRoutes = new ConfigRouter();
configRoutes.init();

export default configRoutes.router;
