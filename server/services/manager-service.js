const {db, models} = require('../rds/db-index')

const teacherService = {};

teacherService.getAll = async () => {
    return await models.teacher.findAll()
};

teacherService.find = async (student_id) =>{
    return await models.teacher.findOne({student_id})
};


module.exports = teacherService;