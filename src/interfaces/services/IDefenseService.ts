import Defenses from "../../units/Defenses";
import Planet from "../../units/Planet";

export default interface IDefenseService {
  getAllDefensesOnPlanet(planetID: number, userID: number): Promise<Defenses>;
  buildDefensesOnPlanet(planetID: number, userID: number, buildOrders: object): Promise<Planet>;
}
