import Techs from "../units/Techs";
import Buildings from "../units/Buildings";
import { IRequirement } from "../interfaces/IGameConfig";
import { Globals } from "../common/Globals";
import IRequirementsService from "../interfaces/services/IRequirementsService";
import { injectable } from "inversify";

@injectable()
export default class RequirementsService implements IRequirementsService {
  public fulfilled(requirements: IRequirement[], buildings: Buildings, technologies: Techs): boolean {
    if (requirements !== undefined) {
      requirements.forEach(function(requirement) {
        const key = Globals.UnitNames[requirement.unitID];

        if (key in buildings && buildings[key] < requirement.level) {
          return false;
        }

        if (key in technologies && technologies[key] < requirement.level) {
          return false;
        }
      });
    }
    return true;
  }
}
