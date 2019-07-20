import { Buildings } from "../units/Buildings";

export interface IBuildingService {
  getBuildings(planetID: number): Promise<Buildings>;
  createBuildingsRow(planetID: number, connection);
}
