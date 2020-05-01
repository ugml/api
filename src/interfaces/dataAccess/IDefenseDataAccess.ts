import Defenses from "../../units/Defenses";

export default interface IDefenseDataAccess {
  createDefenseRow(planetID: number, connection);
  getDefenses(planetID: number, userID: number): Promise<Defenses>;
}
