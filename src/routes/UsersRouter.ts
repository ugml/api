
import { IRouter, NextFunction, Request, Response, Router as newRouter, Router } from "express";
import { Config } from "../common/Config";
import { Database } from "../common/Database";
import { DuplicateRecordException } from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";
import InputValidator from "../common/InputValidator";
import { IAuthorizedRequest } from "../interfaces/IAuthorizedRequest";
import { IGameConfig } from "../interfaces/IGameConfig";
import { Planet, PlanetType } from "../units/Planet";
import { User } from "../units/User";
import PlanetsRouter from "./PlanetsRouter";
import { Logger } from "../common/Logger";

const bcrypt = require("bcryptjs");
import { JwtHelper } from "../common/JwtHelper";

export default class UsersRouter {
  public router: IRouter<{}> = newRouter();

  private userService;
  private galaxyService;
  private planetService;
  private buildingService;
  private defenseService;
  private shipService;
  private techService;

  public constructor(container) {
    this.userService = container.userService;
    this.galaxyService = container.galaxyService;
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.defenseService = container.defenseService;
    this.shipService = container.shipService;
    this.techService = container.techService;

    // /user/create/
    this.router.post("/create", this.createUser);

    // /user/update
    this.router.post("/update", this.updateUser);

    // /user/planet/:planetID
    this.router.get("/planet/:planetID", new PlanetsRouter(container).getOwnPlanet);

    // /user/planetlist/
    this.router.get("/planetlist/", new PlanetsRouter(container).getAllPlanets);

    // /user/planetlist/:userID
    this.router.get("/planetlist/:userID", new PlanetsRouter(container).getAllPlanetsOfUser);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", this.setCurrentPlanet);

    // /users/:userID
    this.router.get("/:userID", this.getUserByID);

    // /user
    this.router.get("/", this.getUserSelf);
  }

  public getUserSelf = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.userID) || !InputValidator.isValidInt(request.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const data = await this.userService.getAuthenticatedUser(parseInt(request.userID, 10));

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
  };

  public getUserByID = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.params.userID) || !InputValidator.isValidInt(request.params.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "Invalid parameter",
          data: {},
        });
      }

      const user = await this.userService.getUserById(request.params.userID);

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
  };

  public createUser = async (request: Request, response: Response, next: NextFunction) => {
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

    const newUser: User = new User();
    const newPlanet: Planet = new Planet();

    try {
      await connection.beginTransaction();

      const data = await this.userService.checkIfNameOrMailIsTaken(username, email);

      if (data.username_taken === 1) {
        throw new DuplicateRecordException("Username is already taken");
      }

      if (data.email_taken === 1) {
        throw new DuplicateRecordException("Email is already taken");
      }

      Logger.info("Getting a new userID");

      newUser.username = username;
      newUser.email = email;

      const userID = await this.userService.getNewId();

      newUser.userID = userID;
      newPlanet.ownerID = userID;
      newUser.password = hashedPassword;
      newPlanet.planet_type = PlanetType.Planet;

      Logger.info("Getting a new planetID");

      const planetID = await await this.planetService.getNewId();

      newUser.currentplanet = planetID;
      newPlanet.planetID = planetID;

      Logger.info("Finding free position for new planet");

      const galaxyData = await this.galaxyService.getFreePosition(
        gameConfig.pos_galaxy_max,
        gameConfig.pos_system_max,
        4,
        12,
      );

      newPlanet.galaxy = galaxyData.galaxy;
      newPlanet.system = galaxyData.system;
      newPlanet.planet = galaxyData.planet;

      Logger.info("Creating a new user");

      await this.userService.createNewUser(newUser, connection);

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

      await await this.planetService.createNewPlanet(newPlanet, connection);

      Logger.info("Creating entry in buildings-table");

      await this.buildingService.createBuildingsRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in defenses-table");

      await this.defenseService.createDefenseRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in ships-table");

      await this.shipService.createShipsRow(newPlanet.planetID, connection);

      Logger.info("Creating entry in galaxy-table");

      await this.galaxyService.createGalaxyRow(
        newPlanet.planetID,
        newPlanet.galaxy,
        newPlanet.system,
        newPlanet.planet,
        connection,
      );

      Logger.info("Creating entry in techs-table");

      await this.techService.createTechRow(newUser.userID, connection);

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
  };

  public updateUser = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
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

      const user: User = await this.userService.getAuthenticatedUser(parseInt(request.userID, 10));

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

      await this.userService.updateUserData(user);

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
  };

  public setCurrentPlanet = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
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

      const planet: Planet = await await this.planetService.getPlanet(userID, planetID);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          status: Globals.Statuscode.BAD_REQUEST,
          message: "The player does not own the planet",
          data: {},
        });
      }

      const user: User = await this.userService.getUserById(userID);

      user.currentplanet = planetID;

      await this.userService.updateUserData(user);

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
  };
}
