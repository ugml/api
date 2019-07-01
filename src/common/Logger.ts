const winston = require("winston");
const { createLogger, format } = winston;
const { combine, printf } = format;
const fs = require("fs");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const date = new Date();
const path = `./logs/${date.getFullYear()}-${date.getMonth() + 1}/`;

// Folder setup
if (!fs.existsSync(path)) {
  fs.mkdir("./logs/");
  fs.mkdir(path);
}

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
    new winston.transports.File({ filename: `${path}/api.log` }),
  ],
});

Logger.getPath = function() {
  return path;
};

export { Logger };
