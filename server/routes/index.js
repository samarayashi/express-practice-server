logger = require('../services/utils/winston-util').logger;
const API_ROUTES = [
    { route: '/demo', apiFile: './demo/api' },
    { route: '/teacher', apiFile: './teacher/api' },
    { route: '/student', apiFile: './student/api' },
   { route: '/common', apiFile: './common/api' }
];


function hookAllApi(httpServer){
    httpServer.use(`/api`, function(req, res, next){
        logger.debug('welcome api layer');
        logger.debug('you request for' + req.originalUrl)
        next()
    });
    API_ROUTES.forEach((routeObj) => {
        httpServer.use(`/api${routeObj.route}`, require(routeObj.apiFile)(httpServer));
    });
};

module.exports = hookAllApi