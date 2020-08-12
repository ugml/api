import IBuildingService from "../interfaces/services/IBuildingService";

import { inject, injectable } from "inversify";
import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import User from "../units/User";

import { Globals } from "../common/Globals";

import Config from "../common/Config";
import Calculations from "../common/Calculations";
import TYPES from "../ioc/types";
import ILogger from "../interfaces/ILogger";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import BuildBuildingRequest from "../entities/requests/BuildBuildingRequest";
import ApiException from "../exceptions/ApiException";
import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import IUserRepository from "../interfaces/repositories/IUserRepository";
import Techs from "../units/Techs";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import IRequirementsService from "../interfaces/services/IRequirementsService";
import IPlanetService from "../interfaces/services/IPlanetService";
import InputValidator from "../common/InputValidator";

import IUnitCosts from "../interfaces/IUnitCosts";

import DemolishBuildingRequest from "../entities/requests/DemolishBuildingRequest";

/**
 * This class defines a service to interact with the buildings-table in the database
 */
@injectable()
export default class BuildingService implements IBuildingService {
  @inject(TYPES.ILogger) private logger: ILogger;

  private planetService: IPlanetService;
  private requirementsService: IRequirementsService;

  private buildingRepository: IBuildingRepository;
  private planetRepository: IPlanetRepository;
  private technologiesRepository: ITechnologiesRepository;
  private userRepository: IUserRepository;

  constructor(
    @inject(TYPES.IPlanetService) planetService: IPlanetService,
    @inject(TYPES.IRequirementsService) requirementsService: IRequirementsService,
    @inject(TYPES.IBuildingRepository) buildingRepository: IBuildingRepository,
    @inject(TYPES.IPlanetRepository) planetRepository: IPlanetRepository,
    @inject(TYPES.ITechnologiesRepository) technologiesRepository: ITechnologiesRepository,
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
  ) {
    this.planetService = planetService;
    this.buildingRepository = buildingRepository;
    this.planetRepository = planetRepository;
    this.technologiesRepository = technologiesRepository;
    this.userRepository = userRepository;
    this.requirementsService = requirementsService;
  }

  public async startBuilding(request: BuildBuildingRequest, userID: number): Promise<Planet> {
    if (!(await this.buildingRepository.exists(request.planetID))) {
      throw new ApiException("Planet does not exist");
    }

    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("User does not own the planet");
    }

    if (planet.isUpgradingBuilding()) {
      throw new ApiException("Planet already has a build-job");
    }

    if (
      (request.buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
        request.buildingID === Globals.Buildings.NANITE_FACTORY ||
        request.buildingID === Globals.Buildings.SHIPYARD) &&
      planet.isBuildingUnits()
    ) {
      throw new ApiException("Can't build this building while it is in use");
    }

    const user: User = await this.userRepository.getById(userID);

    if (request.buildingID === Globals.Buildings.RESEARCH_LAB && user.isResearching()) {
      throw new ApiException("Can't build this building while it is in use");
    }

    const requirements = Config.getGameConfig().units.buildings.find(r => r.unitID === request.buildingID).requirements;
    const technolgies: Techs = await this.technologiesRepository.getById(userID);
    const buildings: Buildings = await this.buildingRepository.getById(request.planetID);

    if (!this.requirementsService.requirementsFulfilled(requirements, buildings, technolgies)) {
      throw new ApiException("Requirements are not met");
    }

    // 3. check if there are enough resources on the planet for the building to be built
    const buildingKey = Globals.UnitNames[request.buildingID];
    const currentLevel = buildings[buildingKey];

    const cost = Calculations.getCosts(request.buildingID, currentLevel);

    if (
      planet.metal < cost.metal ||
      planet.crystal < cost.crystal ||
      planet.deuterium < cost.deuterium ||
      planet.energyUsed < cost.energy
    ) {
      throw new ApiException("Not enough resources");
    }

    // 4. start the build-job
    const buildTime: number = Calculations.calculateBuildTimeInSeconds(
      cost.metal,
      cost.crystal,
      buildings.roboticFactory,
      buildings.naniteFactory,
    );

    const endTime: number = Math.round(+new Date() / 1000) + buildTime;

    planet.metal = planet.metal - cost.metal;
    planet.crystal = planet.crystal - cost.crystal;
    planet.deuterium = planet.deuterium - cost.deuterium;
    planet.bBuildingId = request.buildingID;
    planet.bBuildingEndTime = endTime;

    await this.planetRepository.save(planet);

    return planet;
  }

  public async getBuildings(planetID: number, userID: number): Promise<Buildings> {
    if (!(await this.planetService.checkUserOwnsPlanet(userID, planetID))) {
      throw new UnauthorizedException("Player does not own the planet");
    }

    return await this.buildingRepository.getById(planetID);
  }

  public async cancelBuilding(planetID: number, userID: number): Promise<Planet> {
    if (!(await this.planetService.checkUserOwnsPlanet(userID, planetID))) {
      throw new UnauthorizedException("Player does not own the planet");
    }

    const planet: Planet = await this.planetRepository.getById(planetID);
    const buildings: Buildings = await this.buildingRepository.getById(planetID);

    if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
      throw new ApiException("Planet does not exist");
    }

    if (!planet.isUpgradingBuilding()) {
      throw new ApiException("Planet has no build-job");
    }

    const buildingKey = Globals.UnitNames[planet.bBuildingId];

    const currentLevel = buildings[buildingKey];

    const cost: IUnitCosts = Calculations.getCosts(planet.bBuildingId, currentLevel);

    planet.bBuildingId = 0;
    planet.bBuildingEndTime = 0;
    planet.metal = planet.metal + cost.metal;
    planet.crystal = planet.crystal + cost.crystal;
    planet.deuterium = planet.deuterium + cost.deuterium;

    await this.planetRepository.save(planet);

    return planet;
  }

  public async demolishBuilding(request: DemolishBuildingRequest, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (!InputValidator.isSet(planet)) {
      throw new ApiException("The planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("User does not own the planet");
    }

    const buildings: Buildings = await this.buildingRepository.getById(request.planetID);

    const buildingKey = Globals.UnitNames[request.buildingID];
    const currentLevel = buildings[buildingKey];

    if (currentLevel === 0) {
      throw new ApiException("This building can't be demolished");
    }

    if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildings)) {
      throw new ApiException("Invalid parameter");
    }

    if (planet.isUpgradingBuilding()) {
      throw new ApiException("Planet already has a build-job");
    }

    const cost = Calculations.getCosts(request.buildingID, currentLevel - 1);

    const buildTime: number = Calculations.calculateBuildTimeInSeconds(
      cost.metal,
      cost.crystal,
      buildings.roboticFactory,
      buildings.naniteFactory,
    );

    const endTime: number = Math.round(+new Date() / 1000) + buildTime;

    planet.bBuildingId = request.buildingID;
    planet.bBuildingEndTime = endTime;
    planet.bBuildingDemolition = true;

    await this.planetRepository.save(planet);

    return planet;
  }
}
