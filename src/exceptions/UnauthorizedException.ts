export default class UnauthorizedException extends Error {
  public constructor(m: string) {
    super(m);
  }
}
