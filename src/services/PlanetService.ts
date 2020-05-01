import IPlanetService from "../interfaces/services/IPlanetService";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import Planet from "../units/Planet";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import ITimeService from "../interfaces/services/ITimeService";
import NotEnoughResourcesException from "../exceptions/NotEnoughResourcesException";
import ICostsService from "../interfaces/services/ICostsService";
import InvalidParameterException from "../exceptions/InvalidParameterException";

export default class PlanetService implements IPlanetService {
  private planetDataAccess: IPlanetDataAccess;
  private buildingsDataAccess: IBuildingsDataAccess;

  private timeService: ITimeService;
  private costsService: ICostsService;

  constructor(container) {
    this.planetDataAccess = container.planetDataAccess;
    this.buildingsDataAccess = container.buildingsDataAccess;
    this.timeService = container.timeService;
    this.costsService = container.costsService;
  }

  public async getPlanetByID(planetID: number): Promise<Planet> {
    return await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);
  }

  public async checkPlanetIsUpgradingBuilding(planetID: number): Promise<boolean> {
    const planet = await this.getPlanetByID(planetID);

    return planet.isUpgradingBuilding();
  }

  public async startBuildJob(planet: Planet, buildingID: number): Promise<Planet> {
    const currentLevel = await this.buildingsDataAccess.getCurrentLevelOfBuildingOnPlanet(planet.planetID, buildingID);
    const costs = await this.costsService.getCostsForNextLevel(buildingID, currentLevel);

    if (!planet.hasEnoughResources(costs)) {
      throw new NotEnoughResourcesException("Not enough resources");
    }

    const buildingsOnPlanet = await this.buildingsDataAccess.getBuildings(planet.planetID);
    const buildTime: number = await this.timeService.calculateBuildTime(buildingID, currentLevel, buildingsOnPlanet);

    planet.substractCosts(costs);
    planet.startBuildJob(buildingID, buildTime);

    await this.planetDataAccess.updatePlanet(planet);

    return planet;
  }

  public async startDemolitionJob(planet: Planet, buildingID: number): Promise<Planet> {
    const buildingsOnPlanet = await this.buildingsDataAccess.getBuildings(planet.planetID);
    const currentLevel = await this.buildingsDataAccess.getCurrentLevelOfBuildingOnPlanet(planet.planetID, buildingID);

    if (currentLevel === 0) {
      throw new InvalidParameterException("This building can't be demolished");
    }

    const buildTime: number = await this.timeService.calculateBuildTime(buildingID, currentLevel, buildingsOnPlanet);

    planet.startDemolishJob(buildingID, buildTime);

    return await this.planetDataAccess.updatePlanet(planet);
  }
}
