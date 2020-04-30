export default class PermissionException extends Error {
  /**
   * Takes a message-string and returns a new InvalidParameterException-object
   * @param m the exception-message
   */
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PermissionException.prototype);
  }
}
