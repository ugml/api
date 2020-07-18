import User from "../../units/User";
import AuthenticatedUser from "../../units/AuthenticatedUser";
import UserInfo from "../../units/UserInfo";

export default interface IUserService {
  getAuthenticatedUser(userID: number): Promise<User>;
  getUserById(userID: number): Promise<UserInfo>;
  getUserForAuthentication(email: string): Promise<AuthenticatedUser>;

  checkIfNameOrMailIsTaken(username: string, email: string);
  getNewId(): Promise<number>;
  createNewUser(user: User, connection?);
  updateUserData(user: User, connection?);
}
