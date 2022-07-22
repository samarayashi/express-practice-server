//[Notice] process.env is slow for calling, so we cache here
//const winston: any = require('winston');
const { func } = require('joi');
var winston = require('winston');

function getEnvCache(){
    let envCache
    if (process.env.NODE_ENV == 'develop'){
        envCache = {
            REDIS_PORT: process.env.TEST_REDIS_PORT,
            REDIS_HOST: process.env.TEST_REDIS_HOST,
            SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
        }
    };
    return envCache
}

function infoEnvVar(envCache){
    winston.info(`=====  process.env list =====`);
    for (let [key, value] of Object.entries(envCache)) {
        if (key.includes('KEY')) {
            winston.info(`${key} : ${hideKey(value, 3)}`);
        } else {
            winston.info(`${key} : ${value}`);
        }
    }
    winston.info(`=====  End of process.env list =====`);
    function hideKey(str, showWordLength) {
        if (str && str.length > showWordLength) {
            result = str.slice(-showWordLength).padStart(str.length, '*')
            return result
        } else {
            return string
        }
        }
    };


module.exports = {envCache: getEnvCache,
    infoEnvVar: infoEnvVar};
