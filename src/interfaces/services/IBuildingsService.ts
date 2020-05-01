import Buildings from "../../units/Buildings";
import Planet from "../../units/Planet";

export default interface IBuildingsService {
  getBuildingsOnPlanetWithID(planetID: number, userID: number): Promise<Buildings>;
  cancelBuildingOnPlanetWithID(planetID: number, userID: number): Promise<Planet>;
  startBuildingOnPlanet(planetID: number, buildingID: number, userID: number): Promise<Planet>;
  demolishBuildingOnPlanet(planetID: number, buildingID: number, userID: number): Promise<Planet>;
}
