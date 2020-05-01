import ITimeService from "../interfaces/services/ITimeService";
import Calculations from "../common/Calculations";
import ICostsService from "../interfaces/services/ICostsService";
import Buildings from "../units/Buildings";

export default class TimeService implements ITimeService {
  private costsService: ICostsService;

  constructor(container) {
    this.costsService = container.costsService;
  }

  public async calculateBuildTime(
    buildingID: number,
    currentLevel: number,
    buildingsOnPlanet: Buildings,
  ): Promise<number> {
    const cost = await this.costsService.getCostsForNextLevel(buildingID, currentLevel);

    return Calculations.calculateBuildTimeInSeconds(
      cost.metal,
      cost.crystal,
      buildingsOnPlanet.roboticFactory,
      buildingsOnPlanet.naniteFactory,
    );
  }
}
