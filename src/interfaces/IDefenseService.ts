import Defenses from "../units/Defenses";

export default interface IDefenseService {
  createDefenseRow(planetID: number, connection);
  getDefenses(userID: number, planetID: number): Promise<Defenses>;
}
