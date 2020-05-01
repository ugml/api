import { Globals } from "../common/Globals";
import Exception from "./Exception";

export default class AuthenticationFailedException extends Exception {
  public constructor(message: string) {
    super(message, Globals.Statuscode.NOT_AUTHORIZED);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthenticationFailedException.prototype);
  }
}
