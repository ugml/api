import Buildings from "../../units/Buildings";

export default interface IBuildingsDataAccess {
  getBuildings(planetID: number): Promise<Buildings>;
  createBuildingsRow(planetID: number, connection);
  getCurrentLevelOfBuildingOnPlanet(planetID: number, buildingID: number): Promise<number>;
}
