'use strict'
const logger = require('./winston-util.js').logger;

let envNameList = [
    'NODE_ENV',
    'EXPRESS_PORT',
    'TEST_REDIS_PORT',
    'TEST_REDIS_HOST',
    'MYSQL_HOST',
    'MYSQL_DATABASE',
    'MYSQL_ROOT_PASSWORD',
    'SESSION_SECRET_KEY']

function hideKey(str, showWordLength) {
    if (str && str.length > showWordLength) {
        let result = str.slice(-showWordLength).padStart(str.length, '*')
        return result
    } else {
        return string
    }
}

function infoEnvVars(varList=envNameList){
    if (process.env.NODE_ENV == 'develop'){
        logger.info(`=====  process.env list =====`);
        for (let envName of varList) {
            if (envName.includes('KEY')) {
                logger.info(`${envName} : ${hideKey(process.env[envName], 3)}`);
            } else {
                logger.info(`${envName} : ${process.env[envName]}`);
            }
        }
        logger.info(`=====  End of process.env list =====`);
    }
};


module.exports = {infoEnvVars: infoEnvVars};
