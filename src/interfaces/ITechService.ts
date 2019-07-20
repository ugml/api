import Techs from "../units/Techs";

export interface ITechService {
  createTechRow(userID: number, connection);
  getTechs(userID: number): Promise<Techs>;
}
