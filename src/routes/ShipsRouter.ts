import { NextFunction, Response, Router } from "express";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { Logger } from "../common/Logger";
import { QueueItem } from "../common/QueueItem";
import { Units, UnitType } from "../common/Units";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { ICosts } from "../interfaces/ICosts";
import { BuildingService } from "../services/BuildingService";
import { PlanetService } from "../services/PlanetService";
import { ShipService } from "../services/ShipService";
import { Buildings } from "../units/Buildings";
import { Planet } from "../units/Planet";

const units = new Units();

export class ShipsRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public async getAllShipsOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (!InputValidator.isSet(request.params.planetID) || !InputValidator.isValidInt(request.params.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const ships = await ShipService.getShips(userID, planetID);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: ships,
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  public async buildShips(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      if (
        !InputValidator.isSet(request.body.planetID) ||
        !InputValidator.isValidInt(request.body.planetID) ||
        !InputValidator.isSet(request.body.buildOrder) ||
        !InputValidator.isValidJson(request.body.buildOrder)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.params.planetID, 10);

      const buildOrders = JSON.parse(request.body.buildOrder);

      const queueItem: QueueItem = new QueueItem();

      queueItem.setPlanetID(request.body.planetID);

      // validate build-order
      if (!units.isValidBuildOrder(buildOrders, UnitType.SHIP)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const planet: Planet = await PlanetService.getPlanet(userID, planetID, true);
      const buildings: Buildings = await BuildingService.getBuildings(planetID);

      if (planet === null) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "The player does not own the planet",
          data: {},
        });
      }

      if (planet.b_hangar_plus) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Shipyard is currently upgrading.",
          data: {},
        });
      }

      let metal = planet.metal;
      let crystal = planet.crystal;
      let deuterium = planet.deuterium;

      let stopProcessing = false;
      let buildTime = 0;

      for (const item in buildOrders) {
        if (buildOrders.hasOwnProperty(item)) {
          let count: number = buildOrders[item];
          const cost: ICosts = units.getCosts(parseInt(item, 10), 1, UnitType.SHIP);

          // if the user has not enough ressources to fullfill the complete build-order
          if (metal < cost.metal * count || crystal < cost.crystal * count || deuterium < cost.deuterium * count) {
            let tempCount: number;

            if (cost.metal > 0) {
              tempCount = metal / cost.metal;

              if (tempCount < count) {
                count = tempCount;
              }
            }

            if (cost.crystal > 0) {
              tempCount = crystal / cost.crystal;

              if (tempCount < count) {
                count = tempCount;
              }
            }

            if (cost.deuterium > 0) {
              tempCount = deuterium / cost.deuterium;

              if (tempCount < count) {
                count = tempCount;
              }
            }

            // no need to further process the queue
            stopProcessing = true;
          }

          // build time in seconds
          buildTime +=
            units.getBuildTimeInSeconds(cost.metal, cost.crystal, buildings.shipyard, buildings.nanite_factory) *
            Math.floor(count);

          queueItem.addToQueue(item, Math.floor(count));

          metal -= cost.metal * count;
          crystal -= cost.crystal * count;
          deuterium -= cost.deuterium * count;

          if (stopProcessing) {
            break;
          }
        } else {
          // TODO: throw a meaningful error
          throw Error();
        }
      }

      queueItem.setTimeRemaining(buildTime);
      queueItem.setLastUpdateTime(Math.floor(Date.now() / 1000));

      if (InputValidator.isSet(planet.b_hangar_id)) {
        planet.b_hangar_id += ", ";
      }

      planet.b_hangar_id += JSON.stringify(queueItem);

      if (planet.b_hangar_start_time === 0) {
        planet.b_hangar_start_time = Math.floor(Date.now() / 1000);
      }

      planet.metal = metal;
      planet.crystal = crystal;
      planet.deuterium = deuterium;

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: {},
      });
    } catch (error) {
      Logger.error(error);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:planetID", this.getAllShipsOnPlanet);
    this.router.post("/build/", this.buildShips);
  }
}

const shipsRoutes = new ShipsRouter();
shipsRoutes.init();

export default shipsRoutes.router;
