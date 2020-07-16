import ILogger from "../interfaces/ILogger";
import {injectable} from "inversify";

/**
 * This class represents a simple logger which logs
 * straight to the console.
 */
@injectable()
export default class SimpleLogger implements ILogger {
  /**
   * Log a message of severity 'error'
   * @param message the message
   */
  public error(message: string) {
    // tslint:disable-next-line:no-console
    console.error(message);
  }

  /**
   * Log a message of severity 'warn'
   * @param message the message
   */
  public warn(message: string) {
    // tslint:disable-next-line:no-console
    console.warn(message);
  }

  /**
   * Log a message of severity 'info'
   * @param message the message
   */
  public info(message: string) {
    // tslint:disable-next-line:no-console
    console.info(message);
  }

  /**
   * Log a message of severity 'log'
   * @param message the message
   */
  public log(message: string) {
    // tslint:disable-next-line:no-console
    console.log(message);
  }
}
