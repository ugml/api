import ICostsService from "../interfaces/services/ICostsService";
import ICosts from "../interfaces/ICosts";

import IPricelist from "../interfaces/IPricelist";
import InputValidator from "../common/InputValidator";
import Config from "../common/Config";

export default class CostsService implements ICostsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  constructor(container) {}

  public async getCostsForNextLevel(unitID: number, currentLevel: number): Promise<ICosts> {
    let costs: IPricelist;

    if (InputValidator.isValidBuildingId(unitID)) {
      costs = Config.getBuildings().find(r => r.unitID === unitID).costs;
    } else if (InputValidator.isValidShipId(unitID)) {
      costs = Config.getShips().find(r => r.unitID === unitID).costs;
      currentLevel = 1;
    } else if (InputValidator.isValidDefenseId(unitID)) {
      costs = Config.getDefenses().find(r => r.unitID === unitID).costs;
      currentLevel = 1;
    } else if (InputValidator.isValidTechnologyId(unitID)) {
      costs = Config.getTechnologies().find(r => r.unitID === unitID).costs;
    } else {
      return null;
    }

    return {
      metal: Math.round(costs.metal * costs.factor ** currentLevel),
      crystal: Math.round(costs.crystal * costs.factor ** currentLevel),
      deuterium: Math.round(costs.deuterium * costs.factor ** currentLevel),
      energy: Math.round(costs.energy * costs.factor ** currentLevel),
    };
  }
}
