import ILogger from "../interfaces/ILogger";
import { injectable } from "inversify";

@injectable()
export default class SimpleLogger implements ILogger {

  public error(message: string) {
    // tslint:disable-next-line:no-console
    console.error(message);
  }

  public warn(message: string) {
    // tslint:disable-next-line:no-console
    console.warn(message);
  }

  public info(message: string) {
    // tslint:disable-next-line:no-console
    console.info(message);
  }

  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}
