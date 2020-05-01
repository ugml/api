import IBuildingsService from "../interfaces/services/IBuildingsService";
import Planet from "../units/Planet";
import InputValidator from "../common/InputValidator";
import Buildings from "../units/Buildings";
import UnitDoesNotExistException from "../exceptions/UnitDoesNotExistException";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import IPlanetDataAccess from "../interfaces/dataAccess/IPlanetDataAccess";
import PermissionException from "../exceptions/PermissionException";
import { Globals } from "../common/Globals";
import ICosts from "../interfaces/ICosts";
import Calculations from "../common/Calculations";
import IPlanetService from "../interfaces/services/IPlanetService";
import User from "../units/User";
import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import InvalidParameterException from "../exceptions/InvalidParameterException";
import UnitInUseException from "../exceptions/UnitInUseException";
import RequirementsNotMetException from "../exceptions/RequirementsNotMetException";
import IRequirementService from "../interfaces/services/IRequirementService";

export default class BuildingsService implements IBuildingsService {
  private buildingsDataAccess: IBuildingsDataAccess;
  private planetDataAccess: IPlanetDataAccess;
  private userDataAccess: IUserDataAccess;

  private planetService: IPlanetService;
  private requirementsService: IRequirementService;

  constructor(container) {
    this.buildingsDataAccess = container.buildingsDataAccess;
    this.planetDataAccess = container.planetDataAccess;
    this.userDataAccess = container.userDataAccess;

    this.planetService = container.planetService;
    this.requirementsService = container.requirementsService;
  }

  public async getBuildingsOnPlanetWithID(planetID: number, userID: number): Promise<Buildings> {
    const planet: Planet = await this.planetDataAccess.getPlanetByIDWithBasicInformation(planetID);

    if (!InputValidator.isSet(planet)) {
      throw new UnitDoesNotExistException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new PermissionException("User does not own the planet");
    }

    return await this.buildingsDataAccess.getBuildings(planetID);
  }

  public async cancelBuildingOnPlanetWithID(planetID: number, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

    if (!InputValidator.isSet(planet)) {
      throw new UnitDoesNotExistException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new PermissionException("User does not own the planet");
    }

    if (!planet.isUpgradingBuilding()) {
      throw new InvalidParameterException("Planet has no build-job");
    }

    const buildingsOnPlanet = await this.getBuildingsOnPlanetWithID(planetID, userID);

    const buildingKey = Globals.UnitNames[planet.bBuildingId];
    const currentLevel = buildingsOnPlanet[buildingKey];
    const costs: ICosts = Calculations.getCosts(planet.bBuildingId, currentLevel);

    planet.substractCosts(costs);
    planet.cancelBuilding();

    return await this.planetDataAccess.updatePlanet(planet);
  }

  public async startBuildingOnPlanet(planetID: number, buildingID: number, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

    if (!InputValidator.isSet(planet)) {
      throw new UnitDoesNotExistException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new PermissionException("User does not own the planet");
    }

    if (planet.isUpgradingBuilding()) {
      throw new InvalidParameterException("Planet already has a build-job");
    }

    if (
      (buildingID === Globals.Buildings.ROBOTIC_FACTORY ||
        buildingID === Globals.Buildings.NANITE_FACTORY ||
        buildingID === Globals.Buildings.SHIPYARD) &&
      InputValidator.isSet(planet.bHangarQueue) &&
      planet.isBuildingUnits()
    ) {
      throw new UnitInUseException("Can't build this building while it is in use");
    }

    const user: User = await this.userDataAccess.getAuthenticatedUser(userID);

    if (buildingID === Globals.Buildings.RESEARCH_LAB && user.isResearching()) {
      throw new UnitInUseException("Can't build this building while it is in use");
    }

    if (!(await this.requirementsService.meetsRequirements(buildingID, planetID, userID))) {
      throw new RequirementsNotMetException("Requirements are not met");
    }

    return await this.planetService.startBuildJob(planet, buildingID);
  }

  public async demolishBuildingOnPlanet(planetID: number, buildingID: number, userID: number): Promise<Planet> {
    const planet: Planet = await this.planetDataAccess.getPlanetByIDWithFullInformation(planetID);

    if (!InputValidator.isSet(planet)) {
      throw new UnitDoesNotExistException("Planet does not exist");
    }

    if (planet.ownerID !== userID) {
      throw new PermissionException("User does not own the planet");
    }

    const buildingsOnPlanet: Buildings = await this.buildingsDataAccess.getBuildings(planetID);

    if (!InputValidator.isSet(planet) || !InputValidator.isSet(buildingsOnPlanet)) {
      throw new InvalidParameterException("Invalid parameter");
    }

    if (planet.isUpgradingBuilding()) {
      throw new InvalidParameterException("Planet already has a build-job");
    }

    return await this.planetService.startDemolitionJob(planet, buildingID);
  }
}
