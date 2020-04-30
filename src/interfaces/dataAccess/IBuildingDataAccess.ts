import Buildings from "../../units/Buildings";

export default interface IBuildingDataAccess {
  getBuildings(planetID: number): Promise<Buildings>;
  createBuildingsRow(planetID: number, connection);
}
