import { NextFunction, Response, Router } from "express";
import { Config } from "../common/Config";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { SerializationHelper } from "../common/SerializationHelper";
import { Units, UnitType } from "../common/Units";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { Planet } from "../units/Planet";
import { ICosts } from "../interfaces/ICosts";

import { Logger } from "../common/Logger";

import squel = require("squel");

const units = new Units();

export class BuildingsRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Returns all buildings on a given planet
   * @param request
   * @param response
   * @param next
   */
  public getAllBuildingsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .field("p.ownerID")
      .field("b.*")
      .from("buildings", "b")
      .left_join("planets", "p", "b.planetID = p.planetID")
      .where("b.planetID = ?", request.params.planetID)
      .where("p.ownerID = ?", request.userID)
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

  public cancelBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
      return;
    }

    // get the planet, on which the building should be canceled
    const getPlanetQuery: string = squel
      .select()
      .from("planets", "p")
      .join("buildings", "b", "p.planetID = b.planetID")
      .where("p.planetID = ?", request.body.planetID)
      .where("p.ownerID = ?", request.userID)
      .toString();

    Database.getConnectionPool()
      .query(getPlanetQuery)
      .then(result => {
        if (!InputValidator.isSet(result)) {
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Invalid parameter",
            data: {},
          });
          return;
        }

        // player does not own the planet
        if (!InputValidator.isSet(result[0])) {
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Invalid parameter",
            data: {},
          });
          return;
        }

        const planet: Planet = SerializationHelper.toInstance(new Planet(), JSON.stringify(result[0][0]));

        // 1. check if there is already a build-job on the planet
        if (planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {
          const buildingKey = units.getMappings()[planet.b_building_id];

          // give back the ressources
          const currentLevel = planet[buildingKey];

          const cost: ICosts = units.getCosts(planet.b_building_id, currentLevel, UnitType.BUILDING);

          const updateResourcesQuery: string = squel
            .update()
            .table("planets")
            .set("b_building_id", 0)
            .set("b_building_endtime", 0)
            .set("metal", planet.metal + cost.metal)
            .set("crystal", planet.crystal + cost.crystal)
            .set("deuterium", planet.deuterium + cost.deuterium)
            .where("planetID = ?", planet.planetID)
            .toString();

          return Database.getConnectionPool()
            .query(updateResourcesQuery)
            .then(() => {
              planet.b_building_id = 0;
              planet.b_building_endtime = 0;
              planet.metal = planet.metal + cost.metal;
              planet.crystal = planet.crystal + cost.crystal;
              planet.crystal = planet.crystal + cost.crystal;

              response.status(Globals.Statuscode.SUCCESS).json({
                status: Globals.Statuscode.SUCCESS,
                message: "Building canceled",
                data: { planet },
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
        } else {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Planet has no build-job",
            data: {},
          });
          return;
        }
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

  public async startBuilding(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (
      !InputValidator.isSet(request.body.planetID) ||
      !InputValidator.isValidInt(request.body.planetID) ||
      !InputValidator.isSet(request.body.buildingID) ||
      !InputValidator.isValidInt(request.body.buildingID)
    ) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
      return;
    }

    if (request.body.buildingID < Globals.MIN_BUILDING_ID || request.body.buildingID > Globals.MAX_BUILDING_ID) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    // get the planet, on which the building should be built
    const getPlanetQuery: string = squel
      .select()
      .from("planets", "p")
      .join("buildings", "b", "p.planetID = b.planetID")
      .where("p.planetID = ?", request.body.planetID)
      .where("p.ownerID = ?", request.userID)
      .toString();

    await Database.getConnectionPool()
      .query(getPlanetQuery)
      .then(result => {
        if (!InputValidator.isSet(result)) {
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Invalid parameter",
            data: {},
          });
          return;
        }

        const planet = result[0][0];

        // player does not own the planet
        if (!InputValidator.isSet(planet)) {
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Invalid parameter",
            data: {},
          });
          return;
        }

        // 1. check if there is already a build-job on the planet
        if (planet.b_building_id !== 0 || planet.b_building_endtime !== 0) {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Planet already has a build-job",
            data: {},
          });
          return;
        }

        // can't build shipyard / robotic / nanite while ships or defenses are built
        if (
          (request.body.buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
            request.body.buildingID === Globals.Buildings.NANITE_FACTORY ||
            request.body.buildingID === Globals.Buildings.SHIPYARD) &&
          (planet.b_hangar_id > 0 || planet.b_hangar_starttime > 0)
        ) {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Can't build this building while it is in use",
            data: {},
          });

          return;
        }

        // can't build research lab while they are researching... poor scientists :(
        if (
          request.body.buildingID === Globals.Buildings.RESEARCH_LAB &&
          (planet.b_tech_id > 0 || planet.b_tech_endtime > 0)
        ) {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Can't build this building while it is in use",
            data: {},
          });

          return;
        }

        // 2. check, if requirements are met
        const requirements = units.getRequirements()[request.body.buildingID];

        // building has requirements
        if (requirements !== undefined) {
          let requirementsMet = true;

          for (const reqID in requirements) {
            if (requirements.hasOwnProperty(reqID)) {
              const reqLevel = requirements[reqID];
              const key = units.getMappings()[request.body.buildingID];

              if (planet[key] < reqLevel) {
                requirementsMet = false;
                break;
              }
            } else {
              // TODO: throw a meaningful error
              throw Error();
            }
          }

          if (!requirementsMet) {
            response.status(Globals.Statuscode.SUCCESS).json({
              status: Globals.Statuscode.SUCCESS,
              message: "Requirements are not met",
              data: planet.planetID,
            });

            return;
          }
        }

        // 3. check if there are enough resources on the planet for the building to be built
        const buildingKey = units.getMappings()[request.body.buildingID];
        const currentLevel = planet[buildingKey];

        const cost = units.getCosts(request.body.buildingID, currentLevel, UnitType.BUILDING);

        if (
          planet.metal < cost.metal ||
          planet.crystal < cost.crystal ||
          planet.deuterium < cost.deuterium ||
          planet.energy < cost.energy
        ) {
          response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Not enough resources",
            data: {},
          });
          return;
        }

        // 4. start the build-job
        const buildTime: number = Math.round(
          (cost.metal + cost.crystal) /
            (2500 * (1 + planet.robotic_factory) * 2 ** planet.nanite_factory * Config.Get.speed),
        );

        const endTime: number = Math.round(+new Date() / 1000) + buildTime;

        planet.metal = planet.metal - cost.metal;
        planet.crystal = planet.crystal - cost.crystal;
        planet.deuterium = planet.deuterium - cost.deuterium;
        planet.b_building_id = request.body.buildingID;
        planet.b_building_endtime = endTime;

        const updateResourcesQuery: string = squel
          .update()
          .table("planets")
          .set("metal", planet.metal)
          .set("crystal", planet.crystal)
          .set("deuterium", planet.deuterium)
          .set("b_building_id", planet.b_building_id)
          .set("b_building_endtime", planet.b_building_endtime)
          .where("planetID = ?", request.body.planetID)
          .toString();

        return Database.getConnectionPool()
          .query(updateResourcesQuery)
          .then(() => {
            response.status(Globals.Statuscode.SUCCESS).json({
              status: Globals.Statuscode.SUCCESS,
              message: "Job started",
              data: { planet },
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

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:planetID", this.getAllBuildingsOnPlanet);
    this.router.post("/build", this.startBuilding);
    this.router.post("/cancel", this.cancelBuilding);
  }
}

const buildingRoutes = new BuildingsRouter();
buildingRoutes.init();

export default buildingRoutes.router;
