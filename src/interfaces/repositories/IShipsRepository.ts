import IRepository from "./IRepository";
import Ships from "../../units/Ships";

export default interface IShipsRepository extends IRepository<Ships> {
  createTransactional(planetID: number, connection): Promise<void>;
}
