import { Globals } from "../common/Globals";
import Exception from "./Exception";

export default class EntityInvalidException extends Exception {
  public constructor(m: string) {
    super(m, Globals.Statuscode.BAD_REQUEST);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, EntityInvalidException.prototype);
  }
}
