module.exports = (sequelize, DataTypes) => {
const teacher = sequelize.define('teacher', {
  "teacher_id": {
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
  "tel": {
    "type": "Sequelize.STRING",
    "primaryKey": false,
    "allowNull": true,
    "autoIncrement": false
  }
},
  {   
    tableName: 'teacher',
    freezeTableName: true,
    timestamps: false
  });
  return teacher;
};