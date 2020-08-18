import Techs from "../../units/Techs";
import BuildTechRequest from "../../entities/requests/BuildTechRequest";
import Planet from "../../units/Planet";
import CancelTechRequest from "../../entities/requests/CancelTechRequest";

export default interface ITechService {
  getAll(userID: number): Promise<Techs>;
  build(request: BuildTechRequest, userID: number): Promise<Planet>;
  cancel(request: CancelTechRequest, userID: number): Promise<Planet>;
}
