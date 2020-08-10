import Planet from "../../units/Planet";
import Event from "../../units/Event";
import RenamePlanetRequest from "../../entities/requests/RenamePlanetRequest";

export default interface IPlanetService {
  checkUserOwnsPlanet(userID: number, planetID: number): Promise<boolean>;
  getAllPlanetsOfUser(userID: number): Promise<Planet[]>;
  getMovementOnPlanet(planetID: number, userID: number): Promise<Event[]>;
  destroyPlanet(planetID: number, userID: number): Promise<void>;
  renamePlanet(request: RenamePlanetRequest, userID: number): Promise<Planet>;
  getPlanet(planetID: number, userID: number): Promise<Planet>;
}
