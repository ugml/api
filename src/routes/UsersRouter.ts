import { NextFunction, Request, Response, Router } from "express";
import { Config } from "../common/Config";
import { Database } from "../common/Database";
import { DuplicateRecordException } from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { IGameConfig } from "../interfaces/IGameConfig";
import { UserService } from "../services/UserService";
import { Planet, PlanetType } from "../units/Planet";
import { User } from "../units/User";
import { PlanetsRouter } from "./PlanetsRouter";
import { Logger } from "../common/Logger";

const bcrypt = require("bcryptjs");
import squel = require("squel");
import { JwtHelper } from "../common/JwtHelper";

export class UsersRouter {
  public router: Router;

  public constructor() {
    this.router = Router();

    // /user
    this.router.get("/", this.getUserSelf);

    // /user/create/
    this.router.post("/create", this.createUser);

    // /users/:userID
    this.router.get("/:userID", this.getUserByID);

    // /user/update
    this.router.post("/update", this.updateUser);

    // /user/planet/:planetID
    this.router.get("/planet/:planetID", new PlanetsRouter().getOwnPlanet);

    // /user/planetlist/
    this.router.get("/planetlist/", new PlanetsRouter().getAllPlanetsOfUser);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", new PlanetsRouter().setCurrentPlanet);
  }

  public async getUserSelf(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.userID) || !InputValidator.isValidInt(request.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const data = await UserService.GetAuthenticatedUser(parseInt(request.userID, 10));

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data,
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

  public async getUserByID(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.userID) || !InputValidator.isValidInt(request.params.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const data = await UserService.GetUserById(request.params.userID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: data,
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

  public async createUser(request: Request, response: Response, next: NextFunction) {
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

    const gameConfig: IGameConfig = Config.Get;

    const username: string = InputValidator.sanitizeString(request.body.username);
    const password: string = InputValidator.sanitizeString(request.body.password);
    const email: string = InputValidator.sanitizeString(request.body.email);

    const hashedPassword = bcrypt.hashSync(password, 10);

    const connection = await Database.getConnectionPool().getConnection();

    let newUser: User = new User();
    let newPlanet: Planet = new Planet();

    try {
      await connection.beginTransaction();

      const data = await UserService.CheckIfNameOrMailIsTaken(username, email);

      if (data.username_taken === 1) {
        throw new DuplicateRecordException("Username is already taken");
      }

      if (data.email_taken === 1) {
        throw new DuplicateRecordException("Email is already taken");
      }

      Logger.info("Getting a new userID");

      newUser.username = username;
      newUser.email = email;

      const userID = await UserService.GetNewId();

      newUser.userID = userID;
      newPlanet.ownerID = userID;
      newUser.password = hashedPassword;
      newPlanet.planet_type = PlanetType.Planet;

      Logger.info("Getting a new planetID");

      const queryPlanet = "CALL getNewPlanetId();";

      let [[[planetData]]] = await connection.query(queryPlanet);

      newUser.currentplanet = planetData.planetID;
      newPlanet.planetID = planetData.planetID;

      Logger.info("Finding free position for new planet");

      const queryPosition = `CALL getFreePosition(${gameConfig.pos_galaxy_max}, ${gameConfig.pos_system_max}, 4, 12);`;

      let [[[galaxyData]]] = await connection.query(queryPosition);

      newPlanet.galaxy = galaxyData.posGalaxy;
      newPlanet.system = galaxyData.posSystem;
      newPlanet.planet = galaxyData.posPlanet;

      Logger.info("Creating a new user");

      await newUser.create(connection);

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

      const queryTech = `INSERT INTO techs (\`userID\`) VALUES (${newUser.userID});`;

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
        userID: newUser.userID,
        token: JwtHelper.generateToken(newUser.userID),
      },
    });
  }

  public async updateUser(request: IAuthorizedRequest, response: Response, next: NextFunction) {
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

      const updateUserQuery: string = queryBuilder.where("userID = ?", request.userID).toString();

      // execute the update
      await Database.query(updateUserQuery);

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

const usersRouter = new UsersRouter();

export default usersRouter.router;
