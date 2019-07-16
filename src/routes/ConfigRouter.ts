import { NextFunction, Request, Response, Router } from "express";
import { Globals } from "../common/Globals";

export class ConfigRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public getGameConfig(req: Request, response: Response, next: NextFunction) {
    const data = require("../config/game.json");

    return response.status(Globals.Statuscode.SUCCESS).json(data);
  }

  public getUnitsConfig(req: Request, response: Response, next: NextFunction) {
    const data = require("../config/units.json");

    return response.status(Globals.Statuscode.SUCCESS).json(data);
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/game", this.getGameConfig);
    this.router.get("/units", this.getUnitsConfig);
  }
}

const configRoutes = new ConfigRouter();
configRoutes.init();

export default configRoutes.router;
