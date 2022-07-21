const DB = require('../../fakeDBData')

const ManagerService = {};
ManagerService.getAll = async () => {
    return DB.managers
};

ManagerService.find = async (studentId) =>{
    for (const student of DB.managers) {
        if (student.slice(7) == studentId){
            return student
            }
        } 
};


module.exports = ManagerService;