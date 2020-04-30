import Planet from "../../units/Planet";
import ICoordinates from "../ICoordinates";

export default interface IPlanetDataAccess {
  getPlanet(userID: number, planetID: number, fullInfo?: boolean): Promise<Planet>;
  getPlanetByID(planetID: number): Promise<Planet>;
  updatePlanet(planet: Planet): Promise<Planet>;
  getNewId(): Promise<number>;
  createNewPlanet(planet: Planet, connection?);
  getAllPlanetsOfUser(userID: number, fullInfo?: boolean);
  getMovementOnPlanet(userID: number, planetID: number);
  deletePlanet(userID: number, planetID: number);
  getPlanetOrMoonAtPosition(position: ICoordinates): Promise<Planet>;
}
