const logger = require('./winston-util.js').logger;

// [Notice] process.env is slow for calling, so we cache here
// 但是必要專案中許多地方仍然是利用process.env呼叫環境變數
function getEnvCache(){
    let envCache
    if (process.env.NODE_ENV == 'develop'){
        envCache = {
            NODE_ENV: 'develop',
            REDIS_PORT: process.env.TEST_REDIS_PORT,
            REDIS_HOST: process.env.TEST_REDIS_HOST,
            SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
        }
    };
    return envCache
}

function infoEnvVar(envCache){
    logger.info(`=====  process.env list =====`);
    for (let [key, value] of Object.entries(envCache)) {
        if (key.includes('KEY')) {
            logger.info(`${key} : ${hideKey(value, 3)}`);
        } else {
            logger.info(`${key} : ${value}`);
        }
    }
    logger.info(`=====  End of process.env list =====`);
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
