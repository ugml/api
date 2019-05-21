import winston = require("winston");

const { createLogger, format} = winston;
const { combine, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const Logger : winston.Logger = createLogger({
    levels: {
        error: 0,
        info: 1,
        warn: 2,
        debug: 3
    },
    format: combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/info.log", level: "info" }),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/warn.log", level: "warn" }),
        new winston.transports.File({ filename: "logs/debug.log", level: "debug" })
    ]
});

module.exports = Logger;
