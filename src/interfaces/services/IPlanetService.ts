import Planet from "../../units/Planet";

export default interface IPlanetService {
  getPlanetByID(planetID: number);
  checkPlanetIsUpgradingBuilding(planetID: number);
  startBuildJob(planet: Planet, buildingID: number): Promise<Planet>;
  startDemolitionJob(planet: Planet, buildingID: number): Promise<Planet>;
}
