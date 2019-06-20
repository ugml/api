/***
 * Helper class to distinguish errors.
 * This error is thrown when a parameter is invalid.
 */
class InvalidParameterException extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidParameterException.prototype);
  }
}

export { InvalidParameterException };
