const winston = require('winston');
const { createLogger, format} = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

const Logger = createLogger({
    format: combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        // TODO: split into different files by log-level - afaik, winston has huge problems doing that
        new winston.transports.File({ filename: 'logs/api.log' })
    ]
});

module.exports = Logger;