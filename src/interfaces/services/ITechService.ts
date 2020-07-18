import Techs from "../../units/Techs";

export default interface ITechService {
  createTechRow(userID: number, connection?);
  getTechs(userID: number): Promise<Techs>;
}
