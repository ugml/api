import { Globals } from "../common/Globals";
import Exception from "./Exception";

export default class PermissionException extends Exception {
  public constructor(m: string) {
    super(m, Globals.Statuscode.NOT_AUTHORIZED);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PermissionException.prototype);
  }
}
