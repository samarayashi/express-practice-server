const API_ROUTES = [
    { route: '/demo', apiFile: './demo/api' },
    { route: '/manager', apiFile: './manager/api' },
    { route: '/student', apiFile: './student/api' },
   { route: '/common', apiFile: './common/api' }
];


function hookAllApi(httpServer){
    httpServer.use(`/api`, function(req, res, next){
        console.log('welcome api layer');
        console.log('you request for' + req.originalUrl)
        next()
    });
    API_ROUTES.forEach((routeObj) => {
        httpServer.use(`/api${routeObj.route}`, require(routeObj.apiFile)(httpServer));
    });
};

module.exports = hookAllApi