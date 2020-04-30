export default class AuthenticationFailedException extends Error {
  /**
   * Takes a message-string and returns a new DuplicateRecordException-object
   * @param m the exception-message
   */
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthenticationFailedException.prototype);
  }
}
