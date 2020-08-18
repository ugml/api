import User from "../../units/User";
import CreateUserRequest from "../../entities/requests/CreateUserRequest";
import AuthSuccessResponse from "../../entities/responses/AuthSuccessResponse";
import UpdateUserRequest from "../../entities/requests/UpdateUserRequest";
import SetCurrentPlanetRequest from "../../entities/requests/SetCurrentPlanetRequest";

export default interface IUserService {
  getUserForAuthentication(email: string): Promise<User>;
  getAuthenticatedUser(userID: number): Promise<User>;
  getOtherUser(userID: number): Promise<User>;
  create(request: CreateUserRequest): Promise<AuthSuccessResponse>;
  update(request: UpdateUserRequest, userID: number): Promise<User>;
  setCurrentPlanet(request: SetCurrentPlanetRequest, userID: number): Promise<User>;
}
