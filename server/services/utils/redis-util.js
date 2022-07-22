const Redis = require('ioredis');
const winston = require('winston');



const createClient = (connectOptions, nickName) => {
    let tmpClient = new Redis(connectOptions);
    tmpClient.nickName = nickName;
    
    tmpClient.on('connect', function(){
        winston.info(`create Redis client ${nickName}`);
    });

    tmpClient.on('error', function(err){
        winston.error(`self redis connection down, nickName: ${nickName};`, err);
    });

    tmpClient.on('ready', function () {
        winston.info(
            `connection ready, nickName: ${nickName};`
        );
    });
    tmpClient.on('end', function () {
        winston.info(
            `self redis connection end. nickName: ${nickName}`
        );
    });

    tmpClient.on('close', function (err) {
        if (err) {
            winston.error(
                'close event', err
            );
        } else {
            winston.info(
                'established Redis server connection has closed'
            );
        }
    });
    tmpClient.on('reconnecting', (err) => {
        winston.info(
            `self redis connection reconnecting.....  nickName: ${nickName}`,
            err
        );
    });
    return tmpClient;
}


module.exports = {
    createClient: createClient
};
