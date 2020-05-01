import { Globals } from "../common/Globals";
import Exception from "./Exception";

export default class UnitInUseException extends Exception {
  public constructor(m: string) {
    super(m, Globals.Statuscode.BAD_REQUEST);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnitInUseException.prototype);
  }
}
