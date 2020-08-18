export default class NonExistingEntityException extends Error {
  public constructor(m: string) {
    super(m);
  }
}
