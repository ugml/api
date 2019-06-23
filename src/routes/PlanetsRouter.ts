import { NextFunction, Response, Router } from "express";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";

const mysql = require("mysql2");
import { Logger } from "../common/Logger";

import squel = require("squel");

export class PlanetsRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public setCurrentPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    // check if user owns the planet
    const query: string = squel
      .select()
      .from("planets")
      .where("planetID = ?", request.body.planetID)
      .where("ownerID = ?", request.userID)
      .toString();

    return Database.getConnectionPool()
      .query(query)
      .then(result => {
        if (!InputValidator.isSet(result)) {
          response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
            status: Globals.Statuscode.NOT_AUTHORIZED,
            message: "The player does not own the planet",
            data: {},
          });

          return;
        }

        // TODO: check for unique-constraint violation
        const updateCurrentPlanetQuery: string = squel
          .update()
          .table("users")
          .set("currentplanet = ?", request.body.planetID)
          .where("userID = ?", request.userID)
          .toString();

        return Database.getConnectionPool()
          .query(updateCurrentPlanetQuery)
          .then(() => {
            response.status(Globals.Statuscode.SUCCESS).json({
              status: Globals.Statuscode.SUCCESS,
              message: "Success",
              data: {},
            });

            return;
          });
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

  public getAllPlanetsOfPlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    const query: string = squel
      .select()
      .from("planets")
      .where("ownerID = ?", request.userID)
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result)) {
          data = {};
        } else {
          data = result;
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

        response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SERVER_ERROR,
          message: "There was an error while handling the request.",
          data: {},
        });

        return;
      });
  }

  public getOwnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .from("planets")
      .where("planetID = ?", request.params.planetID)
      .where("ownerID = ?", request.userID)
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result)) {
          data = {};
        } else {
          data = result[0];
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

  public getMovement(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .from("flights")
      .where("ownerID = ?", request.userID)
      .where(
        squel
          .expr()
          .or(`start_id = ${request.params.planetID}`)
          .or(`end_id = ${request.params.planetID}`),
      )
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result)) {
          data = {};
        } else {
          data = Object.assign({}, result);
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

  public destroyPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    // check if it is the last planet of the user
    const query: string = squel
      .select()
      .from("planets")
      .where("ownerID = ?", request.userID)
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        const numRows: number = Object.keys(result).length;

        if (numRows <= 1) {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "The last planet cannot be destroyed.",
            data: {},
          });
          return;
        }

        // destroy the planet
        Database.getConnectionPool().beginTransaction(() => {
          Logger.info("Transaction started");

          const deletePlanetQuery: string = squel
            .delete()
            .from("planets")
            .where("planetID = ?", request.body.planetID)
            .where("ownerID = ?", request.userID)
            .toString();

          Database.getConnectionPool()
            .query(deletePlanetQuery)
            .then(() => {
              Database.getConnectionPool().commit(function(err) {
                if (err) {
                  Database.getConnectionPool().rollback(function() {
                    Logger.error(err);
                    throw err;
                  });
                }
              });

              Logger.info("Transaction complete");

              // TODO: if the deleted planet was the current planet -> set another one as current planet

              response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "The planet was deleted.",
                data: {},
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
        });
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

  public renamePlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (
      !InputValidator.isSet(request.body.planetID) ||
      !InputValidator.isValidInt(request.body.planetID) ||
      !InputValidator.isSet(request.body.name)
    ) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const newName: string = InputValidator.sanitizeString(request.body.name);

    if (newName.length <= 4) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "New name is too short. Minimum length is 4 characters.",
        data: {},
      });

      return;
    }

    // check if it is the last planet of the user
    const query: string = squel
      .update()
      .table("planets")
      .set("name", newName)
      .where("planetID = ?", request.body.planetID)
      .where("ownerID = ?", request.userID)
      .toString();

    Database.getConnectionPool()
      .query(query)
      .then(() => {
        // return the result
        response.status(Globals.Statuscode.SUCCESS).json({
          status: Globals.Statuscode.SUCCESS,
          message: "Success",
          data: {},
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
   * GET planet by ID
   */
  public getPlanetByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .field("planetID")
      .field("ownerID")
      .field("name")
      .field("galaxy")
      .field("system")
      .field("planet")
      .field("last_update")
      .field("planet_type")
      .field("image")
      .field("destroyed")
      .from("planets")
      .where("planetID = ?", request.params.planetID)
      .toString();

    // execute the query
    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result)) {
          data = {};
        } else {
          data = result[0];
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
    // /planets/:planetID
    this.router.get("/:planetID", this.getPlanetByID);
    this.router.get("/movement/:planetID", this.getMovement);
    this.router.post("/destroy/", this.destroyPlanet);
    this.router.post("/rename/", this.renamePlanet);
  }
}

const playerRoutes = new PlanetsRouter();
playerRoutes.init();

export default playerRoutes.router;
