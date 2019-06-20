const winston = require("winston");
const { createLogger, format } = winston;
const { combine, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

/* tslint:disable: variable-name */
const Logger = createLogger({
  /* tslint:enable */
  format: combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    myFormat,
  ),
  transports: [
    new winston.transports.Console(),
    // TODO: split into different files by log-level - afaik, winston has huge problems doing that
    new winston.transports.File({ filename: "logs/api.log" }),
  ],
});

export { Logger };
