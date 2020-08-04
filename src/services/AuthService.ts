import IAuthService from "../interfaces/services/IAuthService";
import InputValidator from "../common/InputValidator";
import Encryption from "../common/Encryption";
import JwtHelper from "../common/JwtHelper";
import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import IUserService from "../interfaces/services/IUserService";
import ApiException from "../exceptions/ApiException";

@injectable()
export default class AuthService implements IAuthService {
  @inject(TYPES.IUserService) private userService: IUserService;

  public async authenticateUser(email: string, password: string): Promise<string> {
    const data = await this.userService.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      throw new ApiException("Invalid parameters");
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      throw new ApiException("Invalid parameters");
    }

    return JwtHelper.generateToken(data.userID);
  }
}
