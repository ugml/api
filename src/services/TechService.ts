import ITechService from "../interfaces/services/ITechService";

import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import ITechnologiesRepository from "../interfaces/repositories/ITechnologiesRepository";
import Techs from "../units/Techs";
import BuildTechRequest from "../entities/requests/BuildTechRequest";
import Planet from "../units/Planet";
import Buildings from "../units/Buildings";
import User from "../units/User";
import InputValidator from "../common/InputValidator";
import { Globals } from "../common/Globals";
import Config from "../common/Config";
import Calculations from "../common/Calculations";

import IPlanetRepository from "../interfaces/repositories/IPlanetRepository";
import IBuildingRepository from "../interfaces/repositories/IBuildingRepository";
import IUserRepository from "../interfaces/repositories/IUserRepository";
import ApiException from "../exceptions/ApiException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import IRequirementsService from "../interfaces/services/IRequirementsService";
import CancelTechRequest from "../entities/requests/CancelTechRequest";
import IUnitCosts from "../interfaces/IUnitCosts";

/**
 * This class defines a service to interact with the techs-table in the database
 */
@injectable()
export default class TechService implements ITechService {
  @inject(TYPES.ITechnologiesRepository) private technologiesRepository: ITechnologiesRepository;
  @inject(TYPES.IPlanetRepository) private planetRepository: IPlanetRepository;
  @inject(TYPES.IBuildingRepository) private buildingRepository: IBuildingRepository;
  @inject(TYPES.IUserRepository) private userRepository: IUserRepository;
  @inject(TYPES.IRequirementsService) private requirementsService: IRequirementsService;

  public async getTechs(userID: number): Promise<Techs> {
    return await this.technologiesRepository.getById(userID);
  }

  public async buildTech(request: BuildTechRequest, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (!InputValidator.isSet(planet)) {
      throw new ApiException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("Player does not own the planet");
    }

    if (planet.isUpgradingResearchLab()) {
      throw new ApiException("Planet is upgrading the research-lab");
    }
    const user: User = await this.userRepository.getById(userID);

    // 1. check if there is already a build-job on the planet
    if (user.isResearching()) {
      throw new ApiException("Planet already has a build-job");
    }

    const buildings: Buildings = await this.buildingRepository.getById(request.planetID);
    const techs: Techs = await this.technologiesRepository.getById(userID);

    // 2. check, if requirements are met
    const requirements = Config.getGameConfig().units.technologies.find(r => r.unitID === request.techID).requirements;

    if (!(await this.requirementsService.requirementsFulfilled(requirements, buildings, techs))) {
      throw new ApiException("Requirements are not met");
    }

    // 3. check if there are enough resources on the planet for the building to be built
    const buildingKey = Globals.UnitNames[request.techID];

    const currentLevel = techs[buildingKey];

    const cost = Calculations.getCosts(request.techID, currentLevel);

    if (
      planet.metal < cost.metal ||
      planet.crystal < cost.crystal ||
      planet.deuterium < cost.deuterium ||
      planet.energyMax < cost.energy
    ) {
      throw new ApiException("Not enough resources");
    }

    // 4. start the build-job
    const buildTime = Calculations.calculateResearchTimeInSeconds(cost.metal, cost.crystal, buildings.researchLab);

    const endTime = Math.round(+new Date() / 1000) + buildTime;

    planet.metal = planet.metal - cost.metal;
    planet.crystal = planet.crystal - cost.crystal;
    planet.deuterium = planet.deuterium - cost.deuterium;
    user.bTechID = request.techID;
    user.bTechEndTime = endTime;

    await this.planetRepository.save(planet);
    await this.userRepository.save(user);

    return planet;
  }

  public async cancelTech(request: CancelTechRequest, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetRepository.getById(request.planetID);

    if (!InputValidator.isSet(planet)) {
      throw new ApiException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new UnauthorizedException("Player does not own the planet");
    }

    const techs: Techs = await this.technologiesRepository.getById(userID);
    const user: User = await this.userRepository.getById(userID);

    // 1. check if there is already a build-job on the planet
    if (!user.isResearching()) {
      throw new ApiException("User is not currently researching");
    }

    const techKey = Globals.UnitNames[user.bTechID];

    const currentLevel = techs[techKey];

    const cost: IUnitCosts = Calculations.getCosts(user.bTechID, currentLevel);

    planet.metal += cost.metal;
    planet.crystal += cost.crystal;
    planet.deuterium += cost.deuterium;
    user.bTechID = 0;
    user.bTechEndTime = 0;

    await this.planetRepository.save(planet);
    await this.userRepository.save(user);

    return planet;
  }
}
