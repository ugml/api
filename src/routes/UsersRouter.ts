import { Globals } from "../common/Globals";

import IBuildingService from "../interfaces/services/IBuildingService";
import IDefenseService from "../interfaces/services/IDefenseService";
import IGalaxyService from "../interfaces/services/IGalaxyService";
import IPlanetService from "../interfaces/services/IPlanetService";
import IShipService from "../interfaces/services/IShipService";
import ITechService from "../interfaces/services/ITechService";
import IUserService from "../interfaces/services/IUserService";

import User from "../units/User";

import ILogger from "../interfaces/ILogger";

import { Route, Get, Tags, SuccessResponse, Controller, Security, Request, Post, Body } from "tsoa";
import { inject } from "inversify";
import TYPES from "../ioc/types";
import { provide } from "inversify-binding-decorators";
import InputValidator from "../common/InputValidator";
import Planet from "../units/Planet";
import FailureResponse from "../interfaces/responses/FailureResponse";
import UserInfo from "../units/UserInfo";

export class SetCurrentPlanetRequest {
  planetID: number;
}

/**
 * Defines routes for user-data
 */
@Tags("UserData")
@Route("user")
@provide(UsersRouter)
export class UsersRouter extends Controller {
  @inject(TYPES.IUserService) private logger: ILogger;

  @inject(TYPES.IUserService) private userService: IUserService;
  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;
  @inject(TYPES.IPlanetService) private planetService: IPlanetService;
  @inject(TYPES.IBuildingService) private buildingService: IBuildingService;
  @inject(TYPES.IDefenseService) private defenseService: IDefenseService;
  @inject(TYPES.IShipService) private shipService: IShipService;
  @inject(TYPES.ITechService) private techService: ITechService;

  /**
   * Returns sensible information about the currently authenticated user
   */
  @Security("jwt")
  @Get("/")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async getUserSelf(@Request() request): Promise<User> {
    return await this.userService.getAuthenticatedUser(request.user.userID);
  }

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImlhdCI6MTU5NTAwMDMzMywiZXhwIjoxNTk1NjA1MTMzfQ.pkkEdN_Kkn6N6z-fKz0BLARc4L18qFRK33irWSsUEMQ
  /**
   * Returns basic information about a user given its userID
   */
  @Security("jwt")
  @Get("/{userID}")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async getUserByID(userID: number): Promise<UserInfo> {
    return await this.userService.getUserById(userID);
  }

  // /**
  //  * Creates a new user with homeplanet
  //  * @param request
  //  * @param response
  //  * @param next
  //  */
  // public createUser = async (request: Request, response: Response) => {
  //   if (
  //     !InputValidator.isSet(request.body.username) ||
  //     !InputValidator.isSet(request.body.password) ||
  //     !InputValidator.isSet(request.body.email)
  //   ) {
  //     return response.status(Globals.StatusCodes.BAD_REQUEST).json({
  //       error: "Invalid parameter",
  //     });
  //   }
  //
  //   const gameConfig: IGameConfig = Config.getGameConfig();
  //
  //   const username: string = InputValidator.sanitizeString(request.body.username);
  //   const password: string = InputValidator.sanitizeString(request.body.password);
  //   const email: string = InputValidator.sanitizeString(request.body.email);
  //
  //   const hashedPassword = await Encryption.hash(password);
  //
  //   const connection = await Database.getConnectionPool().getConnection();
  //
  //   const newUser: User = new User();
  //   const newPlanet: Planet = new Planet();
  //
  //   try {
  //     await connection.beginTransaction();
  //
  //     const data = await this.userService.checkIfNameOrMailIsTaken(username, email);
  //
  //     if (data.username_taken === 1) {
  //       throw new DuplicateRecordException("Username is already taken");
  //     }
  //
  //     if (data.email_taken === 1) {
  //       throw new DuplicateRecordException("Email is already taken");
  //     }
  //
  //     this.logger.info("Getting a new userID");
  //
  //     newUser.username = username;
  //     newUser.email = email;
  //
  //     const userID = await this.userService.getNewId();
  //
  //     newUser.userID = userID;
  //     newPlanet.ownerID = userID;
  //     newUser.password = hashedPassword;
  //     newPlanet.planetType = PlanetType.PLANET;
  //
  //     this.logger.info("Getting a new planetID");
  //
  //     const planetID = await this.planetService.getNewId();
  //
  //     newUser.currentPlanet = planetID;
  //     newPlanet.planetID = planetID;
  //
  //     this.logger.info("Finding free position for new planet");
  //
  //     const galaxyData = await this.galaxyService.getFreePosition(
  //       gameConfig.server.limits.galaxy.max,
  //       gameConfig.server.limits.system.max,
  //       gameConfig.server.startPlanet.minPlanetPos,
  //       gameConfig.server.startPlanet.maxPlanetPos,
  //     );
  //
  //     newPlanet.posGalaxy = galaxyData.posGalaxy;
  //     newPlanet.posSystem = galaxyData.posSystem;
  //     newPlanet.posPlanet = galaxyData.posPlanet;
  //
  //     this.logger.info("Creating a new user");
  //
  //     await this.userService.createNewUser(newUser, connection);
  //
  //     this.logger.info("Creating a new planet");
  //
  //     newPlanet.name = gameConfig.server.startPlanet.name;
  //     newPlanet.lastUpdate = Math.floor(Date.now() / 1000);
  //     newPlanet.diameter = gameConfig.server.startPlanet.diameter;
  //     newPlanet.fieldsMax = gameConfig.server.startPlanet.fields;
  //     newPlanet.metal = gameConfig.server.startPlanet.resources.metal;
  //     newPlanet.crystal = gameConfig.server.startPlanet.resources.crystal;
  //     newPlanet.deuterium = gameConfig.server.startPlanet.resources.deuterium;
  //
  //     switch (true) {
  //       case newPlanet.posPlanet <= 5: {
  //         newPlanet.tempMin = Math.random() * (130 - 40) + 40;
  //         newPlanet.tempMax = Math.random() * (150 - 240) + 240;
  //
  //         const images: string[] = ["desert", "dry"];
  //
  //         newPlanet.image =
  //           images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
  //
  //         break;
  //       }
  //       case newPlanet.posPlanet <= 10: {
  //         newPlanet.tempMin = Math.random() * (130 - 40) + 40;
  //         newPlanet.tempMax = Math.random() * (150 - 240) + 240;
  //
  //         const images: string[] = ["normal", "jungle", "gas"];
  //
  //         newPlanet.image =
  //           images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
  //
  //         break;
  //       }
  //       case newPlanet.posPlanet <= 15: {
  //         newPlanet.tempMin = Math.random() * (130 - 40) + 40;
  //         newPlanet.tempMax = Math.random() * (150 - 240) + 240;
  //
  //         const images: string[] = ["ice", "water"];
  //
  //         newPlanet.image =
  //           images[Math.floor(Math.random() * images.length)] + Math.round(Math.random() * (10 - 1) + 1) + ".png";
  //       }
  //     }
  //
  //     await this.planetService.createNewPlanet(newPlanet, connection);
  //
  //     this.logger.info("Creating entry in buildings-table");
  //
  //     await this.buildingService.createBuildingsRow(newPlanet.planetID, connection);
  //
  //     this.logger.info("Creating entry in defenses-table");
  //
  //     await this.defenseService.createDefenseRow(newPlanet.planetID, connection);
  //
  //     this.logger.info("Creating entry in ships-table");
  //
  //     await this.shipService.createShipsRow(newPlanet.planetID, connection);
  //
  //     this.logger.info("Creating entry in galaxy-table");
  //
  //     await this.galaxyService.createGalaxyRow(
  //       newPlanet.planetID,
  //       newPlanet.posGalaxy,
  //       newPlanet.posSystem,
  //       newPlanet.posPlanet,
  //       connection,
  //     );
  //
  //     this.logger.info("Creating entry in techs-table");
  //
  //     await this.techService.createTechRow(newUser.userID, connection);
  //
  //     connection.commit();
  //
  //     this.logger.info("Transaction complete");
  //
  //     await connection.commit();
  //   } catch (error) {
  //     await connection.rollback();
  //     this.logger.error(error, error);
  //
  //     if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
  //       return response.status(Globals.StatusCodes.BAD_REQUEST).json({
  //         error: `There was an error while handling the request: ${error.message}`,
  //       });
  //     }
  //
  //     return response.status(Globals.StatusCodes.SERVER_ERROR).json({
  //       error: "There was an error while handling the request.",
  //     });
  //   } finally {
  //     await connection.release();
  //   }
  //
  //   return response.status(Globals.StatusCodes.SUCCESS).json({
  //     userID: newUser.userID,
  //     token: JwtHelper.generateToken(newUser.userID),
  //   });
  // };
  //
  // /**
  //  * Updates a user
  //  * @param request
  //  * @param response
  //  * @param next
  //  */
  // public updateUser = async (request: IAuthorizedRequest, response: Response) => {
  //   try {
  //     // if no parameters are set
  //     if (
  //       !InputValidator.isSet(request.body.username) &&
  //       !InputValidator.isSet(request.body.password) &&
  //       !InputValidator.isSet(request.body.email)
  //     ) {
  //       return response.status(Globals.StatusCodes.BAD_REQUEST).json({
  //         error: "No parameters were passed",
  //       });
  //     }
  //
  //     const user: User = await this.userService.getAuthenticatedUser(parseInt(request.userID, 10));
  //
  //     if (InputValidator.isSet(request.body.username)) {
  //       // TODO: Check if username already exists
  //       user.username = InputValidator.sanitizeString(request.body.username);
  //     }
  //
  //     if (InputValidator.isSet(request.body.password)) {
  //       const password = InputValidator.sanitizeString(request.body.password);
  //
  //       user.password = await Encryption.hash(password);
  //     }
  //
  //     if (InputValidator.isSet(request.body.email)) {
  //       user.email = InputValidator.sanitizeString(request.body.email);
  //     }
  //
  //     await this.userService.updateUserData(user);
  //
  //     return response.status(Globals.StatusCodes.SUCCESS).json(user ?? {});
  //   } catch (error) {
  //     this.logger.error(error, error.stack);
  //
  //     if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
  //       return response.status(Globals.StatusCodes.BAD_REQUEST).json({
  //         error: `There was an error while handling the request: ${error.message}`,
  //       });
  //     } else {
  //       return response.status(Globals.StatusCodes.SERVER_ERROR).json({
  //         error: "There was an error while handling the request.",
  //       });
  //     }
  //   }
  // };
  //

  /**
   * Sets the current planet for a user
   */
  @Security("jwt")
  @Post("/currentplanet/set")
  @SuccessResponse(Globals.StatusCodes.SUCCESS)
  public async setCurrentPlanet(
    @Request() request,
    @Body() model: SetCurrentPlanetRequest,
  ): Promise<User | FailureResponse> {
    try {
      const userID = request.user.userID;
      const planetID = model.planetID;

      const planet: Planet = await this.planetService.getPlanet(userID, planetID);

      if (!InputValidator.isSet(planet)) {
        this.setStatus(Globals.StatusCodes.BAD_REQUEST);
        return {
          error: "The player does not own the planet",
        };
      }

      const user: User = await this.userService.getAuthenticatedUser(userID);

      user.currentPlanet = planetID;

      await this.userService.updateUserData(user);

      return user;
    } catch (error) {
      this.logger.error(error, error.stack);

      this.setStatus(Globals.StatusCodes.SERVER_ERROR);
      return {
        error: "There was an error while handling the request.",
      };
    }
  }
}
