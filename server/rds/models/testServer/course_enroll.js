module.exports = (sequelize, DataTypes) => {
const course_enroll = sequelize.define('course_enroll', {
  "enroll_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": true,
    "validate": {
      "isNumeric": true
    },
    "allowNull": true,
    "autoIncrement": true
  },
  "student_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": false,
    "validate": {
      "isNumeric": true
    },
    "allowNull": false,
    "autoIncrement": false
  },
  "course_id": {
    "type": "Sequelize.INTEGER",
    "primaryKey": false,
    "validate": {
      "isNumeric": true
    },
    "allowNull": false,
    "autoIncrement": false
  }
},
  {   
    tableName: 'course_enroll',
    freezeTableName: true,
    timestamps: false
  });
  return course_enroll;
};