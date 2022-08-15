'use strict';
var Sequelize = require('sequelize');
const logger = require('../services/utils/winston-util.js').logger;
var inner_db = {
    //存放db connection 實體
    importDBInstance: function(dbName, instance) {
    let tmpDB = {
        sqlSelect: async function(sql, params, tx){
            let options = {
                type: Sequelize.QueryTypes.SELECT
            };
            if(params){options.replacements = params;}
            if(tx){options.transaction = tx;}
            return await instance.query(sql, options);
        },
        sqlUpdate: async function(sql, params, tx){
            let options = {
                type: Sequelize.QueryTypes.UPDATE
            };
            if(params){options.replacements = params;}
            if(tx){options.transaction = tx;}
            return await instance.query(sql, options);
        },
        sqlInsert: async function(sql, params, tx){
            let options = {
                type: Sequelize.QueryTypes.INSERT
            };
            if(params){options.replacements = params;}
            if(tx){options.transaction = tx;}
            return await instance.query(sql, options);
        },
        sqlDelete: async function(sql, params, tx){
            let options = {
                type: Sequelize.QueryTypes.DELETE
            };
            if(params){options.replacements = params;}
            if(tx){options.transaction = tx;}
            return await instance.query(sql, options);
        },
        sqlQuery: async function(sql, params, tx){
            //如果你想要拿到metadata的話
            let options = {};
            if(params){options.replacements = params;}
            if(tx){options.transaction = tx;}
            return await instance.query(sql, options);
        },
        findAll: async function(sql, params, tx){
        return await tmpDB.sqlSelect(sql, params, tx);
        },

        findOne: async (sql, params, tx) => {
        let result = await tmpDB.sqlSelect(sql, params, tx);
        return result && result.length > 0 ? result[0] : null;
        },


        tx: async() => {
            return await instance.transaction();
        },

          instance:instance
    };
    this.db[dbName] = tmpDB;
  },
  //存放 table model
  importTableModel: function(tableName, modelDefinition){
      if(!tableName || !modelDefinition){
        logger.error('define tableSchema failed');
        return;
      }
      this.models[tableName] = modelDefinition;
      //this.fields[tableName] = modelFieldMap;
  },
  db:{},
  models:{}
  //fields:{}
};

module.exports = inner_db;
