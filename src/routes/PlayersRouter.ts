import { NextFunction, Request, Response, Router } from "express";
import { Database } from "../common/Database";
import { DuplicateRecordException } from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { Planet, PlanetType } from "../units/Planet";
import { User } from "../units/User";
import { PlanetsRouter } from "./PlanetsRouter";
import { Logger } from "../common/Logger";

const bcrypt = require("bcryptjs");
import squel = require("squel");

export class PlayersRouter {
  public router: Router;

  /**
   * Initialize the Router
   */
  public constructor() {
    this.router = Router();

    // Take each handler, and attach to one of the Express.Router's endpoints.

    // /user
    this.router.get("/", this.getPlayerSelf);

    // /user/create/
    this.router.post("/create", this.createPlayer);

    // /users/:playerID
    this.router.get("/:playerID", this.getPlayerByID);

    // /user/update
    this.router.post("/update", this.updatePlayer);

    // /user/planet/:planetID
    this.router.get("/planet/:planetID", new PlanetsRouter().getOwnPlanet);

    // /user/planets/
    this.router.get("/planetlist/", new PlanetsRouter().getAllPlanetsOfPlayer);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", new PlanetsRouter().setCurrentPlanet);
  }

  public getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    const query: string = squel
      .select()
      .field("userID")
      .field("username")
      .field("email")
      .field("onlinetime")
      .field("currentplanet")
      .from("users")
      .where("userID = ?", request.userID)
      .toString();

    // execute the query
    Database.query(query)
      .then(result => {
        let data: {};

        if (InputValidator.isSet(result)) {
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
   * GET player by ID
   */
  public getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // validate parameters
    if (!InputValidator.isSet(request.params.playerID) || !InputValidator.isValidInt(request.params.playerID)) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    const query: string = squel
      .select()
      .distinct()
      .field("userID")
      .field("username")
      .from("users")
      .where("userID = ?", request.params.playerID)
      .toString();

    // execute the query
    Database.query(query)
      .then(result => {
        let data = {};

        if (InputValidator.isSet(result)) {
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

  public async createPlayer(request: Request, response: Response, next: NextFunction) {
    if (
      !InputValidator.isSet(request.body.username) ||
      !InputValidator.isSet(request.body.password) ||
      !InputValidator.isSet(request.body.email)
    ) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "Invalid parameter",
        data: {},
      });

      return;
    }

    // TODO: use the config-class
    const gameConfig = require("../config/game.json");

    const username: string = InputValidator.sanitizeString(request.body.username);
    const password: string = InputValidator.sanitizeString(request.body.password);
    const email: string = InputValidator.sanitizeString(request.body.email);

    const hashedPassword = bcrypt.hashSync(password, 10);

    // TODO: use squel

    // check, if the username or the email is already taken
    const query =
      `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
      `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

    const connection = Database.getConnection().promise();
    try {
      // BEGIN TRANSACTION
      await connection.beginTransaction();

      const rows = await Database.query(query);

      if (rows[0].username_taken === 1) {
        throw new DuplicateRecordException("Username is already taken");
      }

      if (rows[0].email_taken === 1) {
        throw new DuplicateRecordException("Email is already taken");
      }

      Logger.info("Getting a new userID");

      const queryUser = "CALL getNewUserId();";

      const newPlayer: User = new User();
      const newPlanet: Planet = new Planet();

      newPlayer.username = username;
      newPlayer.email = email;

      const data = await Database.query(queryUser).then(row => {
        newPlayer.userID = row[0][0].userID;
        newPlayer.password = hashedPassword;
        newPlanet.ownerID = newPlayer.userID;
        newPlanet.planet_type = PlanetType.Planet;

        return { player: newPlayer, planet: newPlanet };
      });

      Logger.info("Getting a new planetID");

      const queryPlanet = "CALL getNewPlanetId();";

      await Database.query(queryPlanet).then(row => {
        data.player.currentplanet = row[0][0].planetID;
        data.planet.planetID = row[0][0].planetID;
      });
      Logger.info("Finding free position for new planet");

      // getFreePosition(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
      const queryPosition = `CALL getFreePosition(${gameConfig.pos_galaxy_max}, ${gameConfig.pos_system_max}, 4, 12);`;

      await Database.query(queryPosition).then(row => {
        data.planet.galaxy = row[0][0].posGalaxy;
        data.planet.system = row[0][0].posSystem;
        data.planet.planet = row[0][0].posPlanet;
      });

      Logger.info("Creating a new user");

      await data.player.create();

      // TODO extract planet creation
      Logger.info("Creating a new planet");

      data.planet.name = gameConfig.startplanet_name;
      data.planet.last_update = Math.floor(Date.now() / 1000);
      data.planet.diameter = gameConfig.startplanet_diameter;
      data.planet.fields_max = gameConfig.startplanet_maxfields;
      data.planet.metal = gameConfig.metal_start;
      data.planet.crystal = gameConfig.crystal_start;
      data.planet.deuterium = gameConfig.deuterium_start;

      switch (true) {
        case data.planet.planet <= 5: {
          data.planet.temp_min = Math.random() * (130 - 40) + 40;
          data.planet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["desert", "dry"];

          data.planet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case data.planet.planet <= 10: {
          data.planet.temp_min = Math.random() * (130 - 40) + 40;
          data.planet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["normal", "jungle", "gas"];

          data.planet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case data.planet.planet <= 15: {
          data.planet.temp_min = Math.random() * (130 - 40) + 40;
          data.planet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["ice", "water"];

          data.planet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
        }
      }

      await data.planet.create();

      Logger.info("Creating entry in buildings-table");

      const queryBuildings = `INSERT INTO buildings (\`planetID\`) VALUES (${data.planet.planetID});`;

      await Database.query(queryBuildings);

      Logger.info("Creating entry in defenses-table");

      const queryDefenses = `INSERT INTO defenses (\`planetID\`) VALUES (${data.planet.planetID});`;

      await Database.query(queryDefenses);

      Logger.info("Creating entry in fleet-table");

      const queryFleet = `INSERT INTO fleet (\`planetID\`) VALUES (${data.planet.planetID});`;

      await Database.query(queryFleet);

      Logger.info("Creating entry in galaxy-table");

      const queryGalaxy = `INSERT INTO galaxy
                                (
                                  \`planetID\`,
                                  \`pos_galaxy\`,
                                  \`pos_system\`,
                                  \`pos_planet\`
                                )
                          VALUES
                                (
                                  ${data.planet.planetID},
                                  ${data.planet.galaxy},
                                  ${data.planet.system},
                                  ${data.planet.planet}
                                );`
        .split("\n")
        .join("").replace("  ", " ");
      // ^^^ temporary so that the query takes up one line instead of 14 in the log

      await Database.query(queryGalaxy);

      Logger.info("Creating entry in techs-table");

      const queryTech = `INSERT INTO techs (\`userID\`) VALUES (${data.player.userID});`;

      await Database.query(queryTech);

      await connection.commit();

      Logger.info("Transaction complete");
    } catch (error) {
      Logger.error(error);
      await connection.rollback(function() {
        Logger.info("Rolled back transaction");
      });

      if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: `There was an error while handling the request: ${error.message}`,
          data: {},
        });
      }

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });
    }

    // return the result

    return response.status(Globals.Statuscode.SUCCESS).json({
      status: Globals.Statuscode.SUCCESS,
      message: "Success",
      data: {},
    });
  }

  public updatePlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    // if no parameters are set
    if (
      !InputValidator.isSet(request.body.username) &&
      !InputValidator.isSet(request.body.password) &&
      !InputValidator.isSet(request.body.email)
    ) {
      response.status(Globals.Statuscode.NOT_AUTHORIZED).json({
        status: Globals.Statuscode.NOT_AUTHORIZED,
        message: "No parameters were passed",
        data: {},
      });

      return;
    }

    const queryBuilder: squel.Update = squel.update().table("users");

    if (InputValidator.isSet(request.body.username)) {
      const username: string = InputValidator.sanitizeString(request.body.username);

      queryBuilder.set("username", username);
    }

    if (InputValidator.isSet(request.body.password)) {
      const password: string = InputValidator.sanitizeString(request.body.password);

      queryBuilder.set("password", bcrypt.hashSync(password, 10));
    }

    if (InputValidator.isSet(request.body.email)) {
      const email: string = InputValidator.sanitizeString(request.body.email);

      queryBuilder.set("email", email);
    }

    const updatePlayerQuery: string = queryBuilder.where("userID = ?", request.userID).toString();

    // execute the update
    Database.query(updatePlayerQuery)
      .then(() => {
        const getNewDataQuery: string = squel
          .select()
          .field("userID")
          .field("username")
          .field("email")
          .field("onlinetime")
          .field("currentplanet")
          .from("users")
          .where("userID = ?", request.userID)
          .toString();

        // return the updated userdata
        return Database.query(getNewDataQuery).then(result => {
          let data: {};

          if (InputValidator.isSet(result)) {
            data = result[0];
          }

          // return the result
          return response.status(Globals.Statuscode.SUCCESS).json({
            status: Globals.Statuscode.SUCCESS,
            message: "Success",
            data,
          });
        });
      })
      .catch(err => {
        Logger.error(err);

        if (err instanceof DuplicateRecordException || err.message.includes("Duplicate entry")) {
          // return the result
          response.status(Globals.Statuscode.BAD_REQUEST).json({
            status: Globals.Statuscode.BAD_REQUEST,
            message: `There was an error while handling the request: ${err.message}`,
            data: {},
          });
        } else {
          // return the result
          response.status(Globals.Statuscode.SERVER_ERROR).json({
            status: Globals.Statuscode.SERVER_ERROR,
            message: "There was an error while handling the request.",
            data: {},
          });
        }

        return;
      });
  }
}

const playerRoutes = new PlayersRouter();

export default playerRoutes.router;
