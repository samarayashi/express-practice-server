const winston = require('winston');
const studentService = require('../../services/student-service');

module.exports = (httpServer) => {
    let router = require('express').Router();

    router.get('/showAll', async (req, res) => {
        try {
            students = await studentService.getAll()
            return res.status(200).json({code: 200, data: students});
        } catch(err) {
            winston.error('test unexpected error, ', err);
            return res.status(500).json({code: 500, message: 'unexpected error'});
        }
    });

    router.get('/find', async (req, res) => {
        try {
            studentId = req.query.id
            student = await studentService.find(studentId)
            return res.status(200).json({code: 200, data: student});
        } catch(err) {
            winston.error('test unexpected error, ', err);
            return res.status(500).json({code: 500, message: 'unexpected error'});
        }
    });

    return router;
}