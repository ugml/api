export default class InvalidParameterException extends Error {
  public constructor(m: string) {
    super(m);
  }
}
