import Techs from "../../units/Techs";

export default interface ITechDataAccess {
  createTechRow(userID: number, connection);
  getTechs(userID: number): Promise<Techs>;
}
