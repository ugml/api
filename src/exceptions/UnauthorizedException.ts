export default class UnauthorizedException extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}
