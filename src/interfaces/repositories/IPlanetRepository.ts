import IRepository from "./IRepository";
import Planet from "../../units/Planet";
import Event from "../../units/Event";

export default interface IPlanetRepository extends IRepository<Planet> {
  getAllOfUser(userID): Promise<Planet[]>;
  getAllOfOtherUser(userID): Promise<Planet[]>;
  getMovement(userID: number, planetID: number): Promise<Event[]>;
  delete(planetID: number, userID: number): Promise<void>;
  getNewId(): Promise<number>;
  createTransactional(t: Planet, connection): Promise<void>;
}
