import { NextFunction, Response, Router } from "express";
import { Config } from "../common/Config";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";

import { Logger } from "../common/Logger";

import squel = require("squel");

export class GalaxyRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET planet by ID
   */
  public getGalaxyInformation(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (
      !InputValidator.isSet(request.params.galaxy) ||
      !InputValidator.isValidInt(request.params.galaxy) ||
      !InputValidator.isSet(request.params.system) ||
      !InputValidator.isValidInt(request.params.system)
    ) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    if (
      request.params.galaxy < 1 ||
      request.params.galaxy > Config.Get["pos_galaxy_max"] ||
      request.params.system < 1 ||
      request.params.system > Config.Get["pos_system_max"]
    ) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .field("p.planetID")
      .field("p.ownerID")
      .field("u.username")
      .field("p.name")
      .field("p.galaxy")
      .field("p.`system`")
      .field("p.planet")
      .field("p.last_update")
      .field("p.planet_type")
      .field("p.image")
      .field("g.debris_metal")
      .field("g.debris_crystal")
      .field("p.destroyed")
      .from("galaxy", "g")
      .left_join("planets", "p", "g.planetID = p.planetID")
      .left_join("users", "u", "u.userID = p.ownerID")
      .where("pos_galaxy = ?", request.params.galaxy)
      .where("`pos_system` = ?", request.params.system)
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result[0])) {
          data = {};
        } else {
          data = Object.assign({}, result[0]);
        }

        // return the result
        response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Success",
          data,
        });
        return;
      })
      .catch(error => {
        Logger.error(error);

        response.status(Globals.Statuscode.SERVER_ERROR).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: "There was an error while handling the request.",
          data: {},
        });

        return;
      });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:galaxy/:system", this.getGalaxyInformation);
  }
}

const galaxyRouter = new GalaxyRouter();
galaxyRouter.init();

export default galaxyRouter.router;
