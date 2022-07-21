const DB = require('../../fakeDBData')

const StudentService = {};
StudentService.getAll = async () => {
    return DB.students
};

StudentService.find = async (studentId) =>{
    for (const student of DB.students) {
        if (student.slice(7) == studentId){
            return student
            }
        } 
};


module.exports = StudentService;