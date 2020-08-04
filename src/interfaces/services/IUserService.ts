import User from "../../units/User";
import CreateUserRequest from "../../entities/requests/CreateUserRequest";
import AuthResponse from "../../entities/responses/AuthResponse";
import UpdateUserRequest from "../../entities/requests/UpdateUserRequest";
import SetCurrentPlanetRequest from "../../entities/requests/SetCurrentPlanetRequest";

export default interface IUserService {
  getUserForAuthentication(email: string): Promise<User>;
  getAuthenticatedUser(userID: number): Promise<User>;
  getOtherUser(userID: number): Promise<User>;
  createUser(request: CreateUserRequest): Promise<AuthResponse>;
  updateUser(request: UpdateUserRequest, userID: number): Promise<User>;
  setCurrentPlanet(request: SetCurrentPlanetRequest, userID: number): Promise<User>;
}
