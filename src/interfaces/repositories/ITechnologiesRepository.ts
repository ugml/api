import IRepository from "./IRepository";
import Techs from "../../units/Techs";

export default interface ITechnologiesRepository extends IRepository<Techs> {
  createTransactional(userID: number, connection): Promise<void>;
}
