import IUserDataAccess from "../interfaces/dataAccess/IUserDataAccess";
import InputValidator from "../common/InputValidator";
import Encryption from "../common/Encryption";

import JwtHelper from "../common/JwtHelper";
import AuthenticationFailedException from "../exceptions/AuthenticationFailedException";
import IAuthenticationService from "../interfaces/services/IAuthenticationService";

export default class AuthenticationService implements IAuthenticationService {
  private userDataAccess: IUserDataAccess;

  public authenticate = async (email: string, password: string): Promise<string> => {
    const data = await this.userDataAccess.getUserForAuthentication(email);

    if (!InputValidator.isSet(data)) {
      throw new AuthenticationFailedException("Authentication failed.");
    }

    const isValidPassword = await Encryption.compare(password, data.password);

    if (!isValidPassword) {
      throw new AuthenticationFailedException("Authentication failed.");
    }

    return JwtHelper.generateToken(data.userID);
  };
}
