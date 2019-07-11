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
import { JwtHelper } from "../common/JwtHelper";

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

    // /user/planetlist/
    this.router.get("/planetlist/", new PlanetsRouter().getAllPlanetsOfPlayer);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", new PlanetsRouter().setCurrentPlanet);
  }

  public async getPlayerSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
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
      const [result] = await Database.query(query);

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
    } catch (error) {
      Logger.error(error);

      response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });

      return;
    }
  }

  /**
   * GET player by ID
   */
  public async getPlayerByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.playerID) || !InputValidator.isValidInt(request.params.playerID)) {
        response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
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
      let [result] = await Database.query(query);
      let data = {};

      if (InputValidator.isSet(result)) {
        data = result[0];
      }

      // return the result
      response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: data,
      });
      return;
    } catch (error) {
      Logger.error(error);

      response.status(Globals.Statuscode.SERVER_ERROR).json({
        status: Globals.Statuscode.SERVER_ERROR,
        message: "There was an error while handling the request.",
        data: {},
      });

      return;
    }
  }

  public async createPlayer(request: Request, response: Response, next: NextFunction) {
    if (
      !InputValidator.isSet(request.body.username) ||
      !InputValidator.isSet(request.body.password) ||
      !InputValidator.isSet(request.body.email)
    ) {
      response.status(Globals.Statuscode.BAD_REQUEST).json({
        status: Globals.Statuscode.BAD_REQUEST,
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

    const connection = await Database.getConnectionPool().getConnection();

    let newPlayer: User = new User();
    let newPlanet: Planet = new Planet();

    try {
      await connection.beginTransaction();

      // TODO: use squel
      // check, if the username or the email is already taken
      const query =
        `SELECT EXISTS (SELECT 1 FROM users WHERE username LIKE '${username}') AS \`username_taken\`, ` +
        `EXISTS (SELECT 1  FROM users WHERE email LIKE '${email}') AS \`email_taken\``;

      const [data] = await connection.query(query);

      if (data[0].username_taken === 1) {
        throw new DuplicateRecordException("Username is already taken");
      }

      if (data[0].email_taken === 1) {
        throw new DuplicateRecordException("Email is already taken");
      }

      Logger.info("Getting a new userID");

      const queryUser = "CALL getNewUserId();";

      newPlayer.username = username;
      newPlayer.email = email;

      let [[[playerData]]] = await connection.query(queryUser);

      newPlayer.userID = playerData.userID;
      newPlayer.password = hashedPassword;
      newPlanet.ownerID = newPlayer.userID;
      newPlanet.planet_type = PlanetType.Planet;

      Logger.info("Getting a new planetID");

      const queryPlanet = "CALL getNewPlanetId();";

      let [[[planetData]]] = await connection.query(queryPlanet);

      newPlayer.currentplanet = planetData.planetID;
      newPlanet.planetID = planetData.planetID;

      Logger.info("Finding free position for new planet");

      const queryPosition = `CALL getFreePosition(${gameConfig.pos_galaxy_max}, ${gameConfig.pos_system_max}, 4, 12);`;

      let [[[galaxyData]]] = await connection.query(queryPosition);

      newPlanet.galaxy = galaxyData.posGalaxy;
      newPlanet.system = galaxyData.posSystem;
      newPlanet.planet = galaxyData.posPlanet;

      Logger.info("Creating a new user");

      await newPlayer.create(connection);

      // TODO extract planet creation
      Logger.info("Creating a new planet");

      newPlanet.name = gameConfig.startplanet_name;
      newPlanet.last_update = Math.floor(Date.now() / 1000);
      newPlanet.diameter = gameConfig.startplanet_diameter;
      newPlanet.fields_max = gameConfig.startplanet_maxfields;
      newPlanet.metal = gameConfig.metal_start;
      newPlanet.crystal = gameConfig.crystal_start;
      newPlanet.deuterium = gameConfig.deuterium_start;

      switch (true) {
        case newPlanet.planet <= 5: {
          newPlanet.temp_min = Math.random() * (130 - 40) + 40;
          newPlanet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["desert", "dry"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case newPlanet.planet <= 10: {
          newPlanet.temp_min = Math.random() * (130 - 40) + 40;
          newPlanet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["normal", "jungle", "gas"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case newPlanet.planet <= 15: {
          newPlanet.temp_min = Math.random() * (130 - 40) + 40;
          newPlanet.temp_max = Math.random() * (150 - 240) + 240;

          const images: string[] = ["ice", "water"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
        }
      }

      await newPlanet.create(connection);

      Logger.info("Creating entry in buildings-table");

      const queryBuildings = `INSERT INTO buildings (\`planetID\`) VALUES (${newPlanet.planetID});`;

      await connection.query(queryBuildings);

      Logger.info("Creating entry in defenses-table");

      const queryDefenses = `INSERT INTO defenses (\`planetID\`) VALUES (${newPlanet.planetID});`;

      await connection.query(queryDefenses);

      Logger.info("Creating entry in fleet-table");

      const queryFleet = `INSERT INTO fleet (\`planetID\`) VALUES (${newPlanet.planetID});`;

      await connection.query(queryFleet);

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
                                  ${newPlanet.planetID},
                                  ${newPlanet.galaxy},
                                  ${newPlanet.system},
                                  ${newPlanet.planet}
                                );`
        .split("\n")
        .join("")
        .replace("  ", " ");
      // ^^^ temporary so that the query takes up one line instead of 14 in the log

      await connection.query(queryGalaxy);

      Logger.info("Creating entry in techs-table");

      const queryTech = `INSERT INTO techs (\`userID\`) VALUES (${newPlayer.userID});`;

      await connection.query(queryTech);

      connection.commit();

      Logger.info("Transaction complete");

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      Logger.error(error);

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
    } finally {
      await connection.release();
    }

    return response.status(Globals.Statuscode.SUCCESS).json({
      status: Globals.Statuscode.SUCCESS,
      message: "Success",
      data: {
        userID: newPlayer.userID,
        token: JwtHelper.generateToken(newPlayer.userID),
      },
    });
  }

  public async updatePlayer(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // if no parameters are set
      if (
        !InputValidator.isSet(request.body.username) &&
        !InputValidator.isSet(request.body.password) &&
        !InputValidator.isSet(request.body.email)
      ) {
        response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
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
      await Database.query(updatePlayerQuery);

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
      let [result] = await Database.query(getNewDataQuery);

      let data: {};

      if (InputValidator.isSet(result)) {
        data = result[0];
      }

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: data,
      });
    } catch (error) {
      Logger.error(error);

      if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
        // return the result
        response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: `There was an error while handling the request: ${error.message}`,
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
    }
  }
}

const playerRoutes = new PlayersRouter();

export default playerRoutes.router;
