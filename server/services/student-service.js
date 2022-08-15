const {db, models} = require('../rds/db-index')

const studentService = {};

studentService.getAll = async () => {
    return await models.student.findAll()
};

studentService.find = async (student_id) =>{
    return await models.student.findOne({student_id})
};


module.exports = studentService;