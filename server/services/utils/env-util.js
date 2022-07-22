//[Notice] process.env is slow for calling, so we cache here
//const winston: any = require('winston');
var winston = require('winston');
var envCache = {
    testRedisPort: process.env.testRedisPort,
    testRedishost: process.env.testRedishost,
    sessionSecretKey: process.env.sessionSecretKey
};

function infoEnvVar(){
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
            result = str.slice(-showWordLength).padStart(showWordLength, '*')
            return result
        } else {
            return string
        }
        }
    };


module.exports = {envCache: envCache,
    infoEnvVar: infoEnvVar};
