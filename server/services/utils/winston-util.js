/*
winstom可以自己配置輸出格式、和輸出層級規則（transport）
Elearning原本的架構上是在server＞boot底下開一支名為winston.js，將屬性和配置寫覆蓋在全域winston package上
  這隻winston.js只在server入口點被呼叫過一次，因此是放在boot下
  全域物件被覆寫後剩餘的人直接呼叫const winston = require('winston')即可使用已經配置好的logger
  但我覺得這樣容易混淆，想要拉一個util創造logger，每次使用時呼叫自己建的logger和全域的winston package切開
*/

// 每一次都require('winston-util.js').logger
// 目前對logger沒有特殊需求先參考elearning配置

'use strict';
const winston = require('winston');
const { colorize, combine, timestamp, align, printf} = winston.format;

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
} else{
  loggerConfig.level = 'info';
  loggerConfig.format = combine(
    simple(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    align(),
  );
  loggerConfig.transports = [
    new winston.transports.File({ level: loggerConfig.level, filename: './logs/out.log' }),
    new winston.transports.File({ level: 'error', filename: './logs/error.log' }),
  ]
}

const logger = winston.createLogger(loggerConfig);

module.exports = {logger: logger};
