/***
 * Helper class to distinguish errors.
 * This error is thrown when a record already exists in the database.
 */
class DuplicateRecordError extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DuplicateRecordError.prototype);
  }
}

/***
 * Helper class to distinguish errors.
 * This error is thrown when a parameter is invalid.
 */
class InvalidParameter extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidParameter.prototype);
  }
}

export { DuplicateRecordError, InvalidParameter };
