import { NextFunction, Response, Router } from "express";
import { Database } from "../common/Database";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { QueueItem } from "../common/QueueItem";
import { Units, UnitType } from "../common/Units";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { ICosts } from "../interfaces/ICosts";

const units = new Units();
import { Logger } from "../common/Logger";

import squel = require("squel");

export class DefenseRouter {
  // TODO: relocate to Validator-class

  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();
    this.init();
  }

  public getAllDefensesOnPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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
      .field("p.ownerID", "ownerID")
      .field("d.*")
      .from("defenses", "d")
      .left_join("planets", "p", "d.planetID = p.planetID")
      .where("d.planetID = ?", request.params.planetID)
      .where("p.ownerID = ?", request.userID)
      .toString();

    Database.getConnectionPool()
      .query(query)
      .then(result => {
        let data;

        if (!InputValidator.isSet(result)) {
          data = {};
        } else {
          data = result[0][0];
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

  public buildDefense(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    if (
      !InputValidator.isSet(request.body.planetID) ||
      !InputValidator.isValidInt(request.body.planetID) ||
      !InputValidator.isSet(request.body.buildOrder) ||
      !InputValidator.isValidJson(request.body.buildOrder)
    ) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
      return;
    }

    const buildOrders = JSON.parse(request.body.buildOrder);

    const queueItem: QueueItem = new QueueItem();

    queueItem.setPlanetID(request.body.planetID);

    // validate build-order
    if (!units.isValidBuildOrder(buildOrders, UnitType.DEFENSE)) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
        message: "Invalid parameter",
        data: {},
      });
      return;
    }

    const query: string = squel
      .select()
      .field("metal")
      .field("crystal")
      .field("deuterium")
      .field("shipyard")
      .field("nanite_factory")
      .field("b_hangar_plus")
      .field("b_hangar_id")
      .field("b_hangar_start_time")
      .field("ownerID")
      .field("missile_silo")
      .field("anti_ballistic_missile")
      .field("interplanetary_missile")
      .field("missile_silo")
      .from("planets", "p")
      .left_join("buildings", "b", "b.planetID = p.planetID")
      .left_join("defenses", "d", "d.planetID = p.planetID")
      .where("p.planetID = ?", request.body.planetID)
      .where("p.ownerID = ?", request.userID)
      .toString();

    Database.getConnectionPool()
      .query(query)
      .then(result => {
        if (!InputValidator.isSet(result[0][0])) {
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "The player does not own the planet",
            data: {},
          });

          return;
        }

        if (result[0][0].b_hangar_plus === 1) {
          return response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: "Shipyard is currently upgrading.",
            data: {},
          });
        }

        let metal = result[0][0].metal;
        let crystal = result[0][0].crystal;
        let deuterium = result[0][0].deuterium;

        let stopProcessing = false;
        let buildTime = 0;
        let freeSiloSlots: number =
          result[0][0].missile_silo * 10 -
          result[0][0].anti_ballistic_missile -
          result[0][0].interplanetary_missile * 2;

        for (const item in buildOrders) {
          if (buildOrders.hasOwnProperty(item)) {
            let count: number = buildOrders[item];
            const cost: ICosts = units.getCosts(parseInt(item, 10), 1, UnitType.DEFENSE);

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

            // check free slots in silo
            if (item === "309") {
              // can't build any more rockets
              if (freeSiloSlots === 0) {
                buildOrders[item] = 0;
              } else {
                buildOrders[item] = Math.min(freeSiloSlots, buildOrders[item]);
                freeSiloSlots -= buildOrders[item];
              }
            }

            if (item === "310") {
              // can't build any more rockets
              if (freeSiloSlots === 0) {
                buildOrders[item] = 0;
              } else {
                buildOrders[item] = Math.floor(freeSiloSlots / 2) * buildOrders[item];
                freeSiloSlots -= buildOrders[item];
              }
            }

            // build time in seconds
            buildTime +=
              units.getBuildTimeInSeconds(
                cost.metal,
                cost.crystal,
                result[0][0].shipyard,
                result[0][0].nanite_factory,
              ) * Math.floor(count);

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

        let b_hangar_id_new: string = result[0][0].b_hangar_id;
        let b_hangar_start_time_new: number;

        if (InputValidator.isSet(b_hangar_id_new)) {
          b_hangar_id_new += ", ";
        }

        b_hangar_id_new += JSON.stringify(queueItem);

        b_hangar_start_time_new = result[0][0].b_hangar_start_time;

        if (result[0][0].b_hangar_start_time === 0) {
          b_hangar_start_time_new = Math.floor(Date.now() / 1000);
        }

        // update planet
        const updatePlanetQuery: string = squel
          .update()
          .table("planets")
          .set("b_hangar_id", b_hangar_id_new)
          .set("b_hangar_start_time", b_hangar_start_time_new)
          .set("metal", metal)
          .set("crystal", crystal)
          .set("deuterium", deuterium)
          .where("planetID = ?", request.body.planetID)
          .toString();

        Database.getConnectionPool()
          .query(updatePlanetQuery)
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

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get("/:planetID", this.getAllDefensesOnPlanet);
    this.router.post("/build/", this.buildDefense);
  }
}

const defenseRoutes = new DefenseRouter();
defenseRoutes.init();

export default defenseRoutes.router;
