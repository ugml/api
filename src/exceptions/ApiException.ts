export default class ApiException extends Error {
  public constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, ApiException.prototype);
  }
}
