import Buildings from "../../units/Buildings";

export default interface ITimeService {
  calculateBuildTime(buildingID: number, currentLevel: number, buildingsOnPlanet: Buildings): Promise<number>;
}
