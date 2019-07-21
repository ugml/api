import Defenses from "../units/Defenses";

export interface IDefenseService {
  createDefenseRow(planetID: number, connection);
  getDefenses(userID: number, planetID: number): Promise<Defenses>;
}
