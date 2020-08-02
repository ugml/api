import InputValidator from "../../common/InputValidator";

export default class UpdateUserRequest {
  username: string;
  email: string;
  password: string;

  public isValid(): boolean {
    return (
      InputValidator.isSet(this.username) &&
      InputValidator.isSet(this.email) &&
      InputValidator.isSet(this.password) &&
      InputValidator.isValidEmail(this.email)
    );
  }
}
