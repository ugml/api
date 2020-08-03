import IAuthService from "../interfaces/services/IAuthService";
import InputValidator from "../common/InputValidator";
import Encryption from "../common/Encryption";
import JwtHelper from "../common/JwtHelper";
import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import IUserService from "../interfaces/services/IUserService";

@injectable()
export default class AuthService implements IAuthService {
  @inject(TYPES.IUserService) private userService: IUserService;

  public async authenticateUser(email: string, password: string): Promise<string> {
    const data = await this.userService.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      return null;
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      return null;
    }

    return JwtHelper.generateToken(data.userID);
  }
}
