import IUserService from "../interfaces/services/IUserService";
import User from "../units/User";
import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";

import IUserRepository from "../interfaces/repositories/IUserRepository";
import CreateUserRequest from "../entities/requests/CreateUserRequest";
import AuthSuccessResponse from "../entities/responses/AuthSuccessResponse";
import IGameConfig from "../interfaces/IGameConfig";
import Config from "../common/Config";

import Encryption from "../common/Encryption";
import Database from "../common/Database";
import Planet from "../units/Planet";
import DuplicateRecordException from "../exceptions/DuplicateRecordException";
import { Globals } from "../common/Globals";

import JwtHelper from "../common/JwtHelper";

import ApiException from "../exceptions/ApiException";
import PlanetType = Globals.PlanetType;
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import IGalaxyService from "../interfaces/services/IGalaxyService";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import IDefenseRepository from "../interfaces/repositories/IDefenseRepository";
import IShipsRepository from "../interfaces/repositories/IShipsRepository";
import IGalaxyRepository from "../interfaces/repositories/IGalaxyRepository";

import GalaxyRow from "../units/GalaxyRow";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";

import UpdateUserRequest from "../entities/requests/UpdateUserRequest";
import InputValidator from "../common/InputValidator";
import SetCurrentPlanetRequest from "../entities/requests/SetCurrentPlanetRequest";

import UnauthorizedException from "../exceptions/UnauthorizedException";
import ILogger from "../interfaces/ILogger";
import NonExistingEntityException from "../exceptions/NonExistingEntityException";

@injectable()
export default class UserService implements IUserService {
  @inject(TYPES.ILogger) private logger: ILogger;

  @inject(TYPES.IUserRepository) private userRepository: IUserRepository;
  @inject(TYPES.IBuildingRepository) private buildingRepository: IBuildingRepository;
  @inject(TYPES.IPlanetRepository) private planetRepository: IPlanetRepository;
  @inject(TYPES.IDefenseRepository) private defenseRepository: IDefenseRepository;
  @inject(TYPES.IGalaxyRepository) private galaxyRepository: IGalaxyRepository;
  @inject(TYPES.ITechnologiesRepository) private technologiesRepository: ITechnologiesRepository;
  @inject(TYPES.IShipsRepository) private shipsRepository: IShipsRepository;
  @inject(TYPES.IGalaxyService) private galaxyService: IGalaxyService;

  public async getUserForAuthentication(email: string): Promise<User> {
    return await this.userRepository.getUserForAuthentication(email);
  }

  public async getAuthenticatedUser(userID: number): Promise<User> {
    const user = await this.userRepository.getById(userID);

    delete user.password;

    return user;
  }

  public async getOtherUser(userID: number): Promise<User> {
    const user: User = await this.userRepository.getById(userID);

    if (!InputValidator.isSet(user)) {
      throw new NonExistingEntityException("User does not exist");
    }

    return {
      userID: user.userID,
      username: user.username,
    } as User;
  }

  public async create(request: CreateUserRequest): Promise<AuthSuccessResponse> {
    const gameConfig: IGameConfig = Config.getGameConfig();

    const hashedPassword = await Encryption.hash(request.password);

    const connection = await Database.getConnectionPool().getConnection();

    const newUser: User = new User();
    const newPlanet: Planet = new Planet();

    try {
      await connection.beginTransaction();

      if (await this.userRepository.checkEmailTaken(request.email)) {
        throw new ApiException("Email is already taken");
      }

      if (await this.userRepository.checkUsernameTaken(request.username)) {
        throw new ApiException("Username is already taken");
      }

      this.logger.info("Getting a new userID");

      newUser.username = request.username;
      newUser.email = request.email;

      const userID = await this.userRepository.getNewId();

      newUser.userID = userID;
      newPlanet.ownerID = userID;
      newUser.password = hashedPassword;
      newPlanet.planetType = PlanetType.PLANET;

      this.logger.info("Getting a new planetID");

      const planetID = await this.planetRepository.getNewId();

      newUser.currentPlanet = planetID;
      newPlanet.planetID = planetID;

      this.logger.info("Finding free position for new planet");

      const galaxyData = await this.galaxyService.getFreePosition();

      newPlanet.posGalaxy = galaxyData.posGalaxy;
      newPlanet.posSystem = galaxyData.posSystem;
      newPlanet.posPlanet = galaxyData.posPlanet;

      this.logger.info("Creating a new user");

      await this.userRepository.createTransactional(newUser, connection);

      this.logger.info("Creating a new planet");

      newPlanet.name = gameConfig.server.startPlanet.name;
      newPlanet.lastUpdate = Math.floor(Date.now() / 1000);
      newPlanet.diameter = gameConfig.server.startPlanet.diameter;
      newPlanet.fieldsMax = gameConfig.server.startPlanet.fields;
      newPlanet.metal = gameConfig.server.startPlanet.resources.metal;
      newPlanet.crystal = gameConfig.server.startPlanet.resources.crystal;
      newPlanet.deuterium = gameConfig.server.startPlanet.resources.deuterium;

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

      await this.planetRepository.createTransactional(newPlanet, connection);

      this.logger.info("Creating entry in buildings-table");

      await this.buildingRepository.createTransactional(newPlanet.planetID, connection);

      this.logger.info("Creating entry in defenses-table");

      await this.defenseRepository.createTransactional(newPlanet.planetID, connection);

      this.logger.info("Creating entry in ships-table");

      await this.shipsRepository.createTransactional(newPlanet.planetID, connection);

      this.logger.info("Creating entry in galaxy-table");

      const galaxyRow: GalaxyRow = {
        planetID: newPlanet.planetID,
        posGalaxy: newPlanet.posGalaxy,
        posSystem: newPlanet.posSystem,
        posPlanet: newPlanet.posPlanet,
        debrisMetal: 0,
        debrisCrystal: 0,
      } as GalaxyRow;

      await this.galaxyRepository.createTransactional(galaxyRow, connection);

      this.logger.info("Creating entry in techs-table");

      await this.technologiesRepository.createTransactional(newUser.userID, connection);

      connection.commit();

      this.logger.info("Transaction complete");

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      this.logger.error(error, error);

      if (error instanceof ApiException) {
        throw error;
      }

      if (error instanceof DuplicateRecordException || error.message.includes("Duplicate entry")) {
        throw new Error(`There was an error while handling the request: ${error.message}`);
      }

      throw new Error("There was an error while handling the request.");
    } finally {
      await connection.release();
    }

    return {
      token: JwtHelper.generateToken(newUser.userID),
    };
  }

  public async update(request: UpdateUserRequest, userID: number): Promise<User> {
    const user: User = await this.userRepository.getById(userID);

    if (InputValidator.isSet(request.username)) {
      if (await this.userRepository.checkUsernameTaken(request.username)) {
        throw new ApiException("Username already taken");
      }

      user.username = InputValidator.sanitizeString(request.username);
    }

    if (InputValidator.isSet(request.password)) {
      const password = InputValidator.sanitizeString(request.password);

      user.password = await Encryption.hash(password);
    }

    if (InputValidator.isSet(request.email)) {
      if (await this.userRepository.checkEmailTaken(request.email)) {
        throw new ApiException("Email already taken");
      }

      user.email = InputValidator.sanitizeString(request.email);
    }

    await this.userRepository.save(user);

    return user;
  }

  public async setCurrentPlanet(request: SetCurrentPlanetRequest, userID: number): Promise<User> {
    const planetID = request.planetID;

    const planet: Planet = await this.planetRepository.getById(planetID);

    if (!InputValidator.isSet(planet)) {
      throw new NonExistingEntityException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("User does not own the planet");
    }

    const user: User = await this.userRepository.getById(userID);

    user.currentPlanet = planetID;

    await this.userRepository.save(user);

    return user;
  }
}
