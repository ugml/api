import IRequirementsService from "../interfaces/services/IRequirementService";
import { IRequirement } from "../interfaces/IGameConfig";
import Config from "../common/Config";
import InputValidator from "../common/InputValidator";
import { Globals } from "../common/Globals";
import IBuildingsDataAccess from "../interfaces/dataAccess/IBuildingsDataAccess";
import ITechDataAccess from "../interfaces/dataAccess/ITechDataAccess";

export default class RequirementsService implements IRequirementsService {
  private buildingDataAcces: IBuildingsDataAccess;
  private techDataAccess: ITechDataAccess;

  constructor(container) {
    this.buildingDataAcces = container.buildingsDataAccess;
    this.techDataAccess = container.techDataAccess;
  }

  public async getRequirementsForUnit(unitID: number): Promise<IRequirement[]> {
    return Config.getGameConfig().units.buildings.find(r => r.unitID === unitID).requirements;
  }

  public async meetsRequirements(unitID: number, planetID: number, userID: number): Promise<boolean> {
    const requirements = await this.getRequirementsForUnit(unitID);

    if (!InputValidator.isSet(requirements)) {
      return true;
    }

    const availableBuldings = await this.buildingDataAcces.getBuildings(planetID);
    const availableTechnologies = await this.techDataAccess.getTechs(userID);

    for (const requirement of requirements) {
      const key = Globals.UnitNames[requirement.unitID];

      if (InputValidator.isValidBuildingId(requirement.unitID)) {
        if (availableBuldings[key] < requirement.level) {
          return false;
        }
      } else if (InputValidator.isValidTechnologyId(requirement.unitID)) {
        if (availableTechnologies[key] < requirement.level) {
          return false;
        }
      }
    }

    return true;
  }
}
