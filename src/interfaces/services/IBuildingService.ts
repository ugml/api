import Planet from "../../units/Planet";
import BuildBuildingRequest from "../../entities/requests/BuildBuildingRequest";
import Buildings from "../../units/Buildings";
import DemolishBuildingRequest from "../../entities/requests/DemolishBuildingRequest";

export default interface IBuildingService {
  startBuilding(request: BuildBuildingRequest, userID: number): Promise<Planet>;
  getBuildings(planetID: number, userID: number): Promise<Buildings>;
  cancelBuilding(planetID: number, userID: number): Promise<Planet>;
  demolishBuilding(request: DemolishBuildingRequest, userID: number): Promise<Planet>;
}
