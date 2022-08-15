module.exports = (sequelize, DataTypes) => {
const body_tech = sequelize.define('body_tech', {
  "tech_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": true,
    "validate": {
      "isNumeric": true
    },
    "allowNull": true,
    "autoIncrement": true
  },
  "name": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": false,
    "autoIncrement": false
  },
  "source": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  },
  "field": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  },
  "purpose": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  }
},
  {   
    tableName: 'body_tech',
    freezeTableName: true,
    timestamps: false
  });
  return body_tech;
};