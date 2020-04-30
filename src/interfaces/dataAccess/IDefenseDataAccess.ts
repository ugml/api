import Defenses from "../../units/Defenses";

export default interface IDefenseDataAccess {
  createDefenseRow(planetID: number, connection);
  getDefenses(userID: number, planetID: number): Promise<Defenses>;
}
