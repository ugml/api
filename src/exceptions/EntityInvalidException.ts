/**
 * This error should be thrown when an entity is invalid.
 */
export default class EntityInvalidException extends Error {
  /**
   * Takes a message-string and returns a new EntityInvalidException-object
   * @param m the exception-message
   */
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, EntityInvalidException.prototype);
  }
}
