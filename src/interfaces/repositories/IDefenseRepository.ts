import IRepository from "./IRepository";
import Defenses from "../../units/Defenses";

export default interface IDefenseRepository extends IRepository<Defenses> {
  createTransactional(planetID: number, connection): Promise<void>;
}
