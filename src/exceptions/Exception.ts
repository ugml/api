export default abstract class Exception {
  public message: string;
  public readonly statusCode: number;

  protected constructor(m: string, sc: number) {
    this.message = m;
    this.statusCode = sc;
  }
}
