'use strict';
const winston = require('winston');
const {combine, colorize, timestamp, printf, errors, json} = winston.format;

let loggerConfig = {}
if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'lab'){
  loggerConfig.level = 'debug';
  loggerConfig.format = combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    colorize(),
    printf((info) => {
      let {timestamp, level, message} = info;
      return `${timestamp} ${level} : ${message}`
      }
    )
  );
  loggerConfig.transports = [
    new winston.transports.Console()
  ]
} else {
  loggerConfig.level = 'info';
  loggerConfig.format = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  );
  loggerConfig.transports = [
    new winston.transports.File({ level: loggerConfig.level, filename: './logs/out.log' }),
    new winston.transports.File({ level: 'error', filename: './logs/error.log' }),
  ]
}

const logger = winston.createLogger(loggerConfig);

module.exports = {logger: logger};
