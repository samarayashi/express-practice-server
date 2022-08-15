module.exports = (sequelize, DataTypes) => {
const course = sequelize.define('course', {
  "course_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": true,
    "validate": {
      "isNumeric": true
    },
    "allowNull": false,
    "autoIncrement": false
  },
  "tech_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": false,
    "validate": {
      "isNumeric": true
    },
    "allowNull": false,
    "autoIncrement": false
  },
  "name": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": false,
    "autoIncrement": false
  },
  "status": {
    "type": "TINYINT",
    "primaryKey": false,
    "validate": {
      "isNumeric": true
    },
    "allowNull": false,
    "autoIncrement": false
  },
  "start_date": {
    "type": "DATETIME",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  },
  "end_date": {
    "type": "DATETIME",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  }
},
  {   
    tableName: 'course',
    freezeTableName: true,
    timestamps: false
  });
  return course;
};