import Defenses from "../../units/Defenses";
import BuildDefenseRequest from "../../entities/requests/BuildDefenseRequest";
import Planet from "../../units/Planet";

export default interface IDefenseService {
  getDefenses(userID: number, planetID: number): Promise<Defenses>;
  processBuildOrder(request: BuildDefenseRequest, userID: number): Promise<Planet>;
}
