const Redis = require('ioredis');
const logger = require('./winston-util.js').logger;



const createClient = (connectOptions, nickName) => {
    let tmpClient = new Redis(connectOptions);
    tmpClient.nickName = nickName;
    
    tmpClient.on('connect', function(){
        logger.info(`create Redis client ${nickName}`);
    });

    tmpClient.on('error', function(err){
        logger.error(`self redis connection down, nickName: ${nickName};`, err);
    });

    tmpClient.on('ready', function () {
        logger.info(
            `connection ready, nickName: ${nickName};`
        );
    });
    tmpClient.on('end', function () {
        logger.info(
            `self redis connection end. nickName: ${nickName}`
        );
    });

    tmpClient.on('close', function (err) {
        if (err) {
            logger.error(
                'close event', err
            );
        } else {
            logger.info(
                'established Redis server connection has closed'
            );
        }
    });
    tmpClient.on('reconnecting', (err) => {
        logger.info(
            `self redis connection reconnecting.....  nickName: ${nickName}`,
            err
        );
    });
    return tmpClient;
}


module.exports = {
    createClient: createClient
};
