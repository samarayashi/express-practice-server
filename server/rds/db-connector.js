'use strict';
const logger = require('../services/utils/winston-util.js').logger;
const Sequelize = require('sequelize');
const db = require('./db-index');
const fs = require('fs');

logger.log('info', '=== initing RDS connection ... ===');

if (!fs.existsSync(`./server/rds/models`)) {
    logger.info('create model schemas folder...');
    fs.mkdirSync(`./server/rds/models`);
}

// DB config part
const dbConfigs = {
    testServer: {
        // db config
        dialect: 'mysql',
        host: process.env.MYSQL_HOST || 'local_host',
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        username: process.env.MY_SQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        dialectOptions: {
            multipleStatements: true,
        },
        models: [
            // table names
            'student',
            'teacher',
            'course',
            'course_enroll',
            'body_tech'
        ],
    },
};

const defaultPoolOptions = {
    max: 25,
    min: 0,
    acquire: 10000, // 拋出錯誤前最長連線時間
    idle: 5000, // 被釋放前，可在池中閒置多久
    //沒使用maxUses的話, 舊連線不會放給replica; rebalanceWindowSeconds : 多久重新評估一次 db replicas 數量
    //maxUses = rebalanceWindowSeconds * totalRequestsPerSecond / numAppInstances / poolSize,
    maxUses: 600,
};


// model defind part
const sequlizeTypeStrMap = {
    VARCHAR: 'STRING',
    INT: 'INTEGER',
};


function convertType(type) {
    try {
        let tmpType = type.toUpperCase().split('(')[0];
        let q = Sequelize[sequlizeTypeStrMap[tmpType]]
            ? `Sequelize.${sequlizeTypeStrMap[tmpType]}`
            : tmpType;
        if (!q) {
            throw new Error(`models type not found ${type}`);
        }
        return q;
    } catch (e) {
        logger.error(e.message);
        process.abort();
    }
}

function convertName(oriField) {
    // node_** 不轉
    if (/^node_[\d]{2}$/.test(oriField)) {
        return oriField;
    }
    let tmpArr = oriField.split('_');
    let newField = '';
    for (let i = 0; i < tmpArr.length; i++) {
        newField +=
            i == 0
                ? tmpArr[0]
                : `${tmpArr[i].substring(0, 1).toUpperCase()}${tmpArr[i].substring(1)}`;
    }
    return newField;
}

// create sequelize instance
async function createRDSInstance(dbName, options) {
    let replicationOption = {
        write: {
            host: options.host,
            username: options.username,
            password: options.password,
            pool: Object.assign({}, defaultPoolOptions),
        },
        read: {
            host: options.host_ro || options.host,
            username: options.username,
            password: options.password,
            pool: Object.assign({}, defaultPoolOptions),
        },
    };

    let tmpInstance = new Sequelize({
        dialect: options.dialect || 'mysql',
        port: options.port || 3306,
        database: options.database,
        logging: process.env.NODE_ENV === 'develop' ? (msg) => logger.debug(msg) : false,
        dialectOptions: options.dialectOptions,
        replication: replicationOption,
    });

    try {
        await tmpInstance.authenticate();
        //keep connection Instance in db-index;
        db.importDBInstance(options.database, tmpInstance);
        for (let tableName of options.models) {
            if (process.env.NODE_ENV == 'develop') {
                //if dev, create rds models
                logger.info(`dynamic create schema file for table '${tableName}'...`);
                let result = await tmpInstance.queryInterface.describeTable(tableName);
                let tmpModelDefine = {};
                let modelFieldMap = {};
                for (let key in result) {
                    let tmpField = key;
                    // model definition
                    tmpModelDefine[tmpField] = {
                        type: convertType(result[key].type),
                        primaryKey: result[key].primaryKey,
                        validate: result[key].type.includes('INT')
                            ? { isNumeric: true }
                            : undefined,
                        allowNull: result[key].autoIncrement || result[key].allowNull,
                        autoIncrement: result[key].autoIncrement,
                        //"field"        : key
                    };
                    modelFieldMap[convertName(key)] = key;
                }
                if (!fs.existsSync(`./server/rds/models/${dbName}`)) {
                    fs.mkdirSync(`./server/rds/models/${dbName}`);
                }
                let staticModel = `module.exports = (sequelize, DataTypes) => {
const ${tableName} = sequelize.define('${tableName}', ${JSON.stringify(tmpModelDefine, null, 2)},
  {   
    tableName: '${tableName}',
    freezeTableName: true,
    timestamps: false
  });
  return ${tableName};
};`;
                fs.writeFileSync(`./server/rds/models/${dbName}/${tableName}.js`, staticModel);
            }
            // fs 使用工作路徑位置, tmpInstance.import 使用目前檔案相對位置
            if (fs.statSync(`./server/rds/models/${dbName}/${tableName}.js`)) {
                let tmpModel = require(`./models/${dbName}/${tableName}.js`)(tmpInstance, Sequelize.DataTypes);
                db.importTableModel(tableName, tmpModel);
            } else {
                logger.error(`Sequelize import model '${dbName}-${tableName}' failed, do not have definition file`);
                throw new Error(`Sequelize import model '${dbName}-${tableName}' failed, do not have definition file`);
            }
        }
        logger.info(`connecting RDS : ${options.database} successed `);
    } catch (e) {
        logger.error(
            `connecting RDS : ${options.database} failed : ${e}`
        );
        return process.abort();
    }
}

async function ConnectDB(callback) {
    for (let dbName in dbConfigs) {
        logger.info(`connecting RDS : ${dbName} ...`);
        await createRDSInstance(dbName, dbConfigs[dbName]);
    }
    if (callback) {
        callback();
    }
}


module.exports = {
    db: db,
    func_ConnectDB: ConnectDB,
};

