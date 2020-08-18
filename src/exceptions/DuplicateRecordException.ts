export default class DuplicateRecordException extends Error {
  public constructor(m: string) {
    super(m);
  }
}
