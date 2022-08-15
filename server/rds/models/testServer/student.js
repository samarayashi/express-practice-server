module.exports = (sequelize, DataTypes) => {
const student = sequelize.define('student', {
  "student_id": {
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
    tableName: 'student',
    freezeTableName: true,
    timestamps: false
  });
  return student;
};