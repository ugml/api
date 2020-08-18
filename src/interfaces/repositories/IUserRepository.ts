import IRepository from "./IRepository";
import User from "../../units/User";

export default interface IUserRepository extends IRepository<User> {
  getUserForAuthentication(email: string): Promise<User>;
  checkUsernameTaken(username: string): Promise<boolean>;
  checkEmailTaken(email: string): Promise<boolean>;
  getNewId(): Promise<number>;
  createTransactional(t: User, connection): Promise<User>;
}
