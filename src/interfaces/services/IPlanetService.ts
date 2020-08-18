import Planet from "../../units/Planet";
import Event from "../../units/Event";
import RenamePlanetRequest from "../../entities/requests/RenamePlanetRequest";

export default interface IPlanetService {
  checkOwnership(userID: number, planetID: number): Promise<boolean>;
  getAll(userID: number): Promise<Planet[]>;
  getMovement(planetID: number, userID: number): Promise<Event[]>;
  destroy(planetID: number, userID: number): Promise<void>;
  rename(request: RenamePlanetRequest, userID: number): Promise<Planet>;
  getById(planetID: number, userID: number): Promise<Planet>;
}
