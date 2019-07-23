import Buildings from "../units/Buildings";

export default interface IBuildingService {
  getBuildings(planetID: number): Promise<Buildings>;
  createBuildingsRow(planetID: number, connection);
}
