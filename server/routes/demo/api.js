const winston = require('winston');

module.exports = (httpServer) => {
    let router = require('express').Router();

    router.get('/test', async (req, res) => {
        try {
            return res.status(200).json({code: 200, data: 'test success'});
        } catch(err) {
            winston.error('test unexpected error, ', err);
            return res.status(500).json({code: 500, message: 'unexpected error'});
        }
    });

    return router;
}