/**
 * This error should be thrown when a parameter is invalid.
 */
export default class InvalidParameterException extends Error {
  /**
   * Takes a message-string and returns a new InvalidParameterException-object
   * @param m the exception-message
   */
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidParameterException.prototype);
  }
}
