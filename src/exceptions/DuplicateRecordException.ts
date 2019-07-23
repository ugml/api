/**
 * This error should be thrown when a record already exists in the database.
 */
export default class DuplicateRecordException extends Error {
  /**
   * Takes a message-string and returns a new DuplicateRecordException-object
   * @param m the exception-message
   */
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DuplicateRecordException.prototype);
  }
}
