import Planet from "../../units/Planet";
import Event from "../../units/Event";
import RenamePlanetRequest from "../../entities/requests/RenamePlanetRequest";

export default interface IPlanetService {
  checkUserOwnsPlanet(userID: number, planetID: number): Promise<boolean>;
  getAllPlanetsOfUser(userID: number): Promise<Planet[]>;
  getAllPlanetsOfOtherUser(userID: number): Promise<Planet[]>;
  getMovementOnPlanet(planetID: number, userID: number): Promise<Event[]>;
  destroyPlanet(planetID: number, userID: number): Promise<void>;
  renamePlanet(request: RenamePlanetRequest, userID: number): Promise<Planet>;
  getPlanet(planetID: number, userID: number): Promise<Planet>;


  // getPlanet(userID: number, planetID: number, fullInfo?: boolean): Promise<Planet>;
  // updatePlanet(planet: Planet): Promise<Planet>;
  // getNewId(): Promise<number>;
  // createNewPlanet(planet: Planet, connection?);
  // getAllPlanetsOfUser(userID: number, fullInfo?: boolean);
  // checkPlayerOwnsPlanet(userID: number, planetID: number): Promise<boolean>;
  // getMovementOnPlanet(userID: number, planetID: number);
  // deletePlanet(userID: number, planetID: number);
  // getPlanetOrMoonAtPosition(position: ICoordinates): Promise<Planet>;
}
