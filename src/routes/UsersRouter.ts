import { NextFunction, Request, Response, Router } from "express";
import { Config } from "../common/Config";
import { Database } from "../common/Database";
import { DuplicateRecordException } from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";
import { InputValidator } from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { IGameConfig } from "../interfaces/IGameConfig";
import { BuildingService } from "../services/BuildingService";
import { DefenseService } from "../services/DefenseService";
import { ShipService } from "../services/ShipService";
import { GalaxyService } from "../services/GalaxyService";
import { PlanetService } from "../services/PlanetService";
import { TechService } from "../services/TechService";
import { UserService } from "../services/UserService";
import { Planet, PlanetType } from "../units/Planet";
import { User } from "../units/User";
import { PlanetsRouter } from "./PlanetsRouter";
import { Logger } from "../common/Logger";

const bcrypt = require("bcryptjs");
import { JwtHelper } from "../common/JwtHelper";

export class UsersRouter {
  public router: Router;

  public constructor() {
    this.router = Router();

    // /user/create/
    this.router.post("/create", this.createUser);

    // /user/update
    this.router.post("/update", this.updateUser);

    // /user/planet/:planetID
    this.router.get("/planet/:planetID", new PlanetsRouter().getOwnPlanet);

    // /user/planetlist/
    this.router.get("/planetlist/", new PlanetsRouter().getAllPlanets);

    // /user/planetlist/:userID
    this.router.get("/planetlist/:userID", new PlanetsRouter().getAllPlanetsOfUser);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", this.setCurrentPlanet);

    // /users/:userID
    this.router.get("/:userID", this.getUserByID);

    // /user
    this.router.get("/", this.getUserSelf);
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

      const data = await UserService.getAuthenticatedUser(parseInt(request.userID, 10));

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

      const user = await UserService.getUserById(request.params.userID);

      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: user || {},
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

      const data = await UserService.checkIfNameOrMailIsTaken(username, email);

      if (data.username_taken === 1) {
        throw new DuplicateRecordException("Username is already taken");
      }

      if (data.email_taken === 1) {
        throw new DuplicateRecordException("Email is already taken");
      }

      Logger.info("Getting a new userID");

      newUser.username = username;
      newUser.email = email;

      const userID = await UserService.getNewId();

      newUser.userID = userID;
      newPlanet.ownerID = userID;
      newUser.password = hashedPassword;
      newPlanet.planet_type = PlanetType.Planet;

      Logger.info("Getting a new planetID");

      const planetID = await PlanetService.getNewId();

      newUser.currentplanet = planetID;
      newPlanet.planetID = planetID;

      Logger.info("Finding free position for new planet");

      const galaxyData = await GalaxyService.getFreePosition(
        gameConfig.pos_galaxy_max,
        gameConfig.pos_system_max,
        4,
        12,
      );

      newPlanet.galaxy = galaxyData.galaxy;
      newPlanet.system = galaxyData.system;
      newPlanet.planet = galaxyData.planet;

      Logger.info("Creating a new user");

      await UserService.createNewUser(newUser, connection);

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

      await PlanetService.createNewPlanet(newPlanet, connection);

      Logger.info("Creating entry in buildings-table");

      await BuildingService.createBuildingsRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in defenses-table");

      await DefenseService.createDefenseRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in ships-table");

      await ShipService.createShipsRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in galaxy-table");

      await GalaxyService.createGalaxyRow(
        newPlanet.planetID,
        newPlanet.galaxy,
        newPlanet.system,
        newPlanet.planet,
        connection,
      );

      Logger.info("Creating entry in techs-table");

      await TechService.createTechRow(newUser.userID, connection);

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

      let user: User = await UserService.getAuthenticatedUser(parseInt(request.userID, 10));

      if (InputValidator.isSet(request.body.username)) {
        user.username = InputValidator.sanitizeString(request.body.username);
      }

      if (InputValidator.isSet(request.body.password)) {
        const password = InputValidator.sanitizeString(request.body.password);

        user.password = bcrypt.hashSync(password, 10);
      }

      if (InputValidator.isSet(request.body.email)) {
        user.email = InputValidator.sanitizeString(request.body.email);
      }

      await UserService.updateUserData(user);

      // return the result
      return response.status(Globals.Statuscode.SUCCESS).json({
        status: Globals.Statuscode.SUCCESS,
        message: "Success",
        data: user,
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

  public async setCurrentPlanet(request: IAuthorizedRequest, response: Response, next: NextFunction) {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await PlanetService.getPlanet(userID, planetID);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "The player does not own the planet",
          data: {},
        });
      }

      const user: User = await UserService.getUserById(userID);

      user.currentplanet = planetID;

      await UserService.updateUserData(user);

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
}

const usersRouter = new UsersRouter();

export default usersRouter.router;
