import Planet from "../../units/Planet";
import BuildBuildingRequest from "../../entities/requests/BuildBuildingRequest";
import Buildings from "../../units/Buildings";
import DemolishBuildingRequest from "../../entities/requests/DemolishBuildingRequest";

export default interface IBuildingService {
  start(request: BuildBuildingRequest, userID: number): Promise<Planet>;
  getAll(planetID: number, userID: number): Promise<Buildings>;
  cancel(planetID: number, userID: number): Promise<Planet>;
  demolish(request: DemolishBuildingRequest, userID: number): Promise<Planet>;
}
