import User from "../units/User";

export default interface IUserService {
  getAuthenticatedUser(userID: number): Promise<User>;
  getUserById(userID: number): Promise<User>;
  getUserForAuthentication(email: string): Promise<User>;
  checkIfNameOrMailIsTaken(username: string, email: string);
  getUserByMail(email: string): Promise<User>;
  getNewId(): Promise<number>;
  createNewUser(user: User, connection?);
  updateUserData(user: User, connection?);
}
