import IRepository from "./IRepository";
import Buildings from "../../units/Buildings";

export default interface IBuildingRepository extends IRepository<Buildings> {
  createTransactional(planetID: number, connection): Promise<void>;
}
