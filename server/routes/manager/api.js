const logger = require('../../services/utils/winston-util').logger;
const managerService = require('../../services/manager-service');
const Auth = require('../../middlewares/signin-checker');

module.exports = (httpServer) => {
    // routerInit
    let router = require('express').Router();
    
    // router level middleware, check login 
    router.use(Auth.apiCheckBS);

    // api/manager/showAll
    router.post('/showAll', async (req, res) => {
        try {
            managers = await managerService.getAll()
            return res.status(200).json({code: 200, data: managers});
        } catch(err) {
            logger.error('test unexpected error, ', err);
            return res.status(500).json({code: 500, message: 'unexpected error'});
        }
    });
    // api/manager/find
    router.post('/find', async (req, res) => {
        try {
            managerId = req.query.id
            manager = await managerService.find(managerId)
            return res.status(200).json({code: 200, data: manager});
        } catch(err) {
            logger.error('test unexpected error, ', err);
            return res.status(500).json({code: 500, message: 'unexpected error'});
        }
    });

    return router;
}