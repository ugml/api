import ILogger from "../interfaces/ILogger";
import { Graylog } from "ts-graylog/dist";
import { GraylogMessage } from "ts-graylog/dist/models/message.model";
import { GraylogLevelEnum } from "ts-graylog/dist/models/enums.model";

/**
 * This class represents a simple logger which logs
 * straight to the this.graylog.
 */
export default class GraylogLogger implements ILogger {
  private serverUrl: string;
  private port: number;
  private graylog: Graylog = new Graylog({
    servers: [{ host: "127.0.0.1", port: 12201 }],
    hostname: "server.name",
    bufferSize: 1350,
  });

  /**
   * Creates a new GralogLogger instance
   */
  public constructor() {
    this.serverUrl = "0.0.0.0";
    this.port = 12201;
  }

  /**
   * Log a message of severity 'error'
   * @param messageText the message
   * @param stackTrace the stacktrace
   */
  public error(messageText: string, stackTrace: string) {
    const message = new GraylogMessage({
      version: "1.0",
      short_message: messageText,
      timestamp: Date.now() / 1000,
      level: GraylogLevelEnum.ERROR,
      facility: "api",
      stack_trace: stackTrace,
    });

    this.graylog.error(message, null);
  }

  /**
   * Log a message of severity 'warn'
   * @param messageText the message
   */
  public warn(messageText: string) {
    const message = new GraylogMessage({
      version: "1.0",
      short_message: messageText,
      timestamp: Date.now() / 1000,
      level: GraylogLevelEnum.WARNING,
    });

    this.graylog.warning(message, null);
  }

  /**
   * Log a message of severity 'info'
   * @param messageText the message
   */
  public info(messageText: string) {
    const message = new GraylogMessage({
      version: "1.0",
      short_message: messageText,
      timestamp: Date.now() / 1000,
      level: GraylogLevelEnum.INFO,
    });

    this.graylog.info(message);
  }

  /**
   * Log a message of severity 'log'
   * @param messageText the message
   */
  public log(messageText: string) {
    const message = new GraylogMessage({
      version: "1.0",
      short_message: messageText,
      timestamp: Date.now() / 1000,
      level: GraylogLevelEnum.NOTICE,
    });

    this.graylog.log(message);
  }

  /**
   * Log a message of severity 'debug'
   * @param messageText
   */
  public debug(messageText: string) {
    const message = new GraylogMessage({
      version: "1.0",
      short_message: messageText,
      timestamp: Date.now() / 1000,
      level: GraylogLevelEnum.DEBUG,
    });

    this.graylog.log(message);
  }
}
