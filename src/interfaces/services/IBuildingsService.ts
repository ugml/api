import Buildings from "../../units/Buildings";

export default interface IBuildingsService {
  getBuildingsOnPlanetWithID(planetID: number, userID: number): Promise<Buildings>;
}
