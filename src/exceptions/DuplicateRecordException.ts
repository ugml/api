/**
 * Helper class to distinguish errors.
 * This error is thrown when a record already exists in the database.
 */
class DuplicateRecordException extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DuplicateRecordException.prototype);
  }
}

export { DuplicateRecordException };
