import Techs from "../../units/Techs";
import BuildTechRequest from "../../entities/requests/BuildTechRequest";
import Planet from "../../units/Planet";
import CancelTechRequest from "../../entities/requests/CancelTechRequest";

export default interface ITechService {
  getTechs(userID: number): Promise<Techs>;
  buildTech(request: BuildTechRequest, userID: number): Promise<Planet>;
  cancelTech(request: CancelTechRequest, userID: number): Promise<Planet>;
}
