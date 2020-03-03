import { NextFunction, Request, Response, Router } from "express";
import Config from "../common/Config";
import Database from "../common/Database";
import DuplicateRecordException from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";
import Encryption from "../common/Encryption";
import InputValidator from "../common/InputValidator";
import IAuthorizedRequest from "../interfaces/IAuthorizedRequest";
import IBuildingService from "../interfaces/IBuildingService";
import IDefenseService from "../interfaces/IDefenseService";
import IGalaxyService from "../interfaces/IGalaxyService";
import IGameConfig from "../interfaces/IGameConfig";
import IPlanetService from "../interfaces/IPlanetService";
import IShipService from "../interfaces/IShipService";
import ITechService from "../interfaces/ITechService";
import IUserService from "../interfaces/IUserService";
import Planet from "../units/Planet";
import User from "../units/User";
import PlanetsRouter from "./PlanetsRouter";
import JwtHelper from "../common/JwtHelper";
import PlanetType = Globals.PlanetType;
import ILogger from "../interfaces/ILogger";
import IResetTokenService from "../interfaces/IResetTokenService";
import ResetToken from "../units/ResetToken";
import EntityInvalidException from "../exceptions/EntityInvalidException";

/**
 * Defines routes for user-data
 */
export default class UsersRouter {
  public router: Router = Router();

  private logger: ILogger;

  private userService: IUserService;
  private galaxyService: IGalaxyService;
  private planetService: IPlanetService;
  private buildingService: IBuildingService;
  private defenseService: IDefenseService;
  private shipService: IShipService;
  private techService: ITechService;
  private resetTokenService: IResetTokenService;

  /**
   * Registers the routes and needed services
   * @param container the IoC-container with registered services
   * @param logger Instance of an ILogger-object
   */
  public constructor(container, logger: ILogger) {
    this.userService = container.userService;
    this.galaxyService = container.galaxyService;
    this.planetService = container.planetService;
    this.buildingService = container.buildingService;
    this.defenseService = container.defenseService;
    this.shipService = container.shipService;
    this.techService = container.techService;
    this.resetTokenService = container.resetTokenService;

    // /user/create/
    this.router.post("/create", this.createUser);

    // /user/update
    this.router.post("/update", this.updateUser);

    // /user/planet/:planetID
    this.router.get("/planet/:planetID", new PlanetsRouter(container, logger).getOwnPlanet);

    // /user/planetlist/
    this.router.get("/planetlist/", new PlanetsRouter(container, logger).getAllPlanets);

    // /users/planetlist/:userID
    this.router.get("/planetlist/:userID", new PlanetsRouter(container, logger).getAllPlanetsOfUser);

    // /user/currentplanet/set/:planetID
    this.router.post("/currentplanet/set", this.setCurrentPlanet);

    // /users/:userID
    this.router.get("/:userID", this.getUserByID);

    // /user/forgot
    this.router.post("/forgot", this.forgotPassword);

    // /user/reset
    this.router.post("/resetPassword", this.resetPassword);

    // /user
    this.router.get("/", this.getUserSelf);

    this.logger = logger;
  }

  /**
   * Returns sensible information about the currently authenticated user
   * @param request
   * @param response
   * @param next
   */
  public getUserSelf = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.userID) || !InputValidator.isValidInt(request.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const data = await this.userService.getAuthenticatedUser(parseInt(request.userID, 10));

      return response.status(Globals.Statuscode.SUCCESS).json(data ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Returns basic information about a user given its userID
   * @param request
   * @param response
   * @param next
   */
  public getUserByID = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (!InputValidator.isSet(request.params.userID) || !InputValidator.isValidInt(request.params.userID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID: number = parseInt(request.params.userID, 10);

      const user = await this.userService.getUserById(userID);

      return response.status(Globals.Statuscode.SUCCESS).json(user ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  /**
   * Creates a new user with homeplanet
   * @param request
   * @param response
   * @param next
   */
  public createUser = async (request: Request, response: Response, next: NextFunction) => {
    if (
      !InputValidator.isSet(request.body.username) ||
      !InputValidator.isSet(request.body.password) ||
      !InputValidator.isSet(request.body.email)
    ) {
      return response.status(Globals.Statuscode.BAD_REQUEST).json({
        error: "Invalid parameter",
      });
    }

    const gameConfig: IGameConfig = Config.getGameConfig();

    const username: string = InputValidator.sanitizeString(request.body.username);
    const password: string = InputValidator.sanitizeString(request.body.password);
    const email: string = InputValidator.sanitizeString(request.body.email);

    const hashedPassword = await Encryption.hash(password);

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

      this.logger.info("Getting a new userID");

      newUser.username = username;
      newUser.email = email;

      const userID = await this.userService.getNewId();

      newUser.userID = userID;
      newPlanet.ownerID = userID;
      newUser.password = hashedPassword;
      newPlanet.planetType = PlanetType.Planet;

      this.logger.info("Getting a new planetID");

      const planetID = await await this.planetService.getNewId();

      newUser.currentPlanet = planetID;
      newPlanet.planetID = planetID;

      this.logger.info("Finding free position for new planet");

      const galaxyData = await this.galaxyService.getFreePosition(
        gameConfig.posGalaxyMax,
        gameConfig.posSystemMax,
        4,
        12,
      );

      newPlanet.posGalaxy = galaxyData.posGalaxy;
      newPlanet.posSystem = galaxyData.posSystem;
      newPlanet.posPlanet = galaxyData.posPlanet;

      this.logger.info("Creating a new user");

      await this.userService.createNewUser(newUser, connection);

      this.logger.info("Creating a new planet");

      newPlanet.name = gameConfig.startPlanetName;
      newPlanet.lastUpdate = Math.floor(Date.now() / 1000);
      newPlanet.diameter = gameConfig.startPlanetDiameter;
      newPlanet.fieldsMax = gameConfig.startPlanetMaxFields;
      newPlanet.metal = gameConfig.metalStart;
      newPlanet.crystal = gameConfig.crystalStart;
      newPlanet.deuterium = gameConfig.deuteriumStart;

      switch (true) {
        case newPlanet.posPlanet <= 5: {
          newPlanet.tempMin = Math.random() * (130 - 40) + 40;
          newPlanet.tempMax = Math.random() * (150 - 240) + 240;

          const images: string[] = ["desert", "dry"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case newPlanet.posPlanet <= 10: {
          newPlanet.tempMin = Math.random() * (130 - 40) + 40;
          newPlanet.tempMax = Math.random() * (150 - 240) + 240;

          const images: string[] = ["normal", "jungle", "gas"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";

          break;
        }
        case newPlanet.posPlanet <= 15: {
          newPlanet.tempMin = Math.random() * (130 - 40) + 40;
          newPlanet.tempMax = Math.random() * (150 - 240) + 240;

          const images: string[] = ["ice", "water"];

          newPlanet.image =
            images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
        }
      }

      await this.planetService.createNewPlanet(newPlanet, connection);

      this.logger.info("Creating entry in buildings-table");

      await this.buildingService.createBuildingsRow(newPlanet.planetID, connection);

      this.logger.info("Creating entry in defenses-table");

      await this.defenseService.createDefenseRow(newPlanet.planetID, connection);

      this.logger.info("Creating entry in ships-table");

      await this.shipService.createShipsRow(newPlanet.planetID, connection);

      this.logger.info("Creating entry in galaxy-table");

      await this.galaxyService.createGalaxyRow(
        newPlanet.planetID,
        newPlanet.posGalaxy,
        newPlanet.posSystem,
        newPlanet.posPlanet,
        connection,
      );

      this.logger.info("Creating entry in techs-table");

      await this.techService.createTechRow(newUser.userID, connection);

      connection.commit();

      this.logger.info("Transaction complete");

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      this.logger.error(error, error);

      if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: `There was an error while handling the request: ${error.message}`,
        });
      }

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    } finally {
      await connection.release();
    }

    return response.status(Globals.Statuscode.SUCCESS).json({
      userID: newUser.userID,
      token: JwtHelper.generateToken(newUser.userID),
    });
  };

  /**
   * Updates a user
   * @param request
   * @param response
   * @param next
   */
  public updateUser = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // if no parameters are set
      if (
        !InputValidator.isSet(request.body.username) &&
        !InputValidator.isSet(request.body.password) &&
        !InputValidator.isSet(request.body.email)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "No parameters were passed",
        });
      }

      const user: User = await this.userService.getAuthenticatedUser(parseInt(request.userID, 10));

      if (InputValidator.isSet(request.body.username)) {
        // TODO: Check if username already exists
        user.username = InputValidator.sanitizeString(request.body.username);
      }

      if (InputValidator.isSet(request.body.password)) {
        const password = InputValidator.sanitizeString(request.body.password);

        user.password = await Encryption.hash(password);
      }

      if (InputValidator.isSet(request.body.email)) {
        user.email = InputValidator.sanitizeString(request.body.email);
      }

      await this.userService.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json(user ?? {});
    } catch (error) {
      this.logger.error(error, error.stack);

      if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: `There was an error while handling the request: ${error.message}`,
        });
      } else {
        return response.status(Globals.Statuscode.SERVER_ERROR).json({
          error: "There was an error while handling the request.",
        });
      }
    }
  };

  /**
   * Sets the current planet for a user
   * @param request
   * @param response
   * @param next
   */
  public setCurrentPlanet = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.body.planetID) || !InputValidator.isValidInt(request.body.planetID)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const userID = parseInt(request.userID, 10);
      const planetID = parseInt(request.body.planetID, 10);

      const planet: Planet = await await this.planetService.getPlanet(userID, planetID);

      if (!InputValidator.isSet(planet)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "The player does not own the planet",
        });
      }

      const user: User = await this.userService.getUserById(userID);

      user.currentPlanet = planetID;

      await this.userService.updateUserData(user);

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public resetPassword = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      if (
        !InputValidator.isSet(request.body.token) ||
        !InputValidator.isSet(request.body.email) ||
        !InputValidator.isSet(request.body.newPassword)
      ) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const token = InputValidator.sanitizeString(request.body.token);
      const email = InputValidator.sanitizeString(request.body.email);

      // all tokens, which are older than 24h are invalid
      const lastValidTimestamp = Math.round(+new Date() / 1000) - 24 * 60 * 60;

      const matchingResetToken = await this.resetTokenService.getTokenFromMail(email);

      if (!InputValidator.isSet(matchingResetToken) || matchingResetToken.resetToken !== token) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid token",
        });
      }

      if (matchingResetToken.requestedAt < lastValidTimestamp) {
        return response.status(Globals.Statuscode.SUCCESS).json({
          error: "Token is not valid anymore",
        });
      }

      if (InputValidator.isSet(matchingResetToken.usedAt)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Token was already used",
        });
      }

      const newPassword = InputValidator.sanitizeString(request.body.newPassword);

      const user = await this.userService.getUserForAuthentication(email);

      user.password = await Encryption.hash(newPassword);

      await this.userService.updateUserData(user);

      const currentTimestamp: number = Math.round(+new Date() / 1000);

      await this.resetTokenService.setTokenUsed(matchingResetToken.resetToken, currentTimestamp);

      // TODO: send mail stating, that the password was reset

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };

  public forgotPassword = async (request: IAuthorizedRequest, response: Response, next: NextFunction) => {
    try {
      // validate parameters
      if (!InputValidator.isSet(request.body.email)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "Invalid parameter",
        });
      }

      const token: ResetToken = new ResetToken();

      token.email = InputValidator.sanitizeString(request.body.email);

      // all tokens, which are older than 24h are invalid
      const lastValidTimestamp = Math.round(+new Date() / 1000) - 24 * 60 * 60;

      if (await this.resetTokenService.checkIfResetAlreadyRequested(token.email, lastValidTimestamp)) {
        return response.status(Globals.Statuscode.BAD_REQUEST).json({
          error: "A request for this mail-address was already made.",
        });
      }

      token.ipRequested = request.ip;
      token.requestedAt = Math.round(+new Date() / 1000);

      const generatedToken = await Encryption.generateToken();

      token.resetToken = InputValidator.sanitizeString(generatedToken).substr(0, 64);

      if (!token.isValid()) {
        throw new EntityInvalidException("The resetToken-entity is invalid.");
      }

      await this.resetTokenService.storeResetToken(token);

      // TODO: send mail if the given mail is connected to a account

      return response.status(Globals.Statuscode.SUCCESS).json({});
    } catch (error) {
      this.logger.error(error, error.stack);

      return response.status(Globals.Statuscode.SERVER_ERROR).json({
        error: "There was an error while handling the request.",
      });
    }
  };
}
