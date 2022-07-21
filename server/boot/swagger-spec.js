'use strict';
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.0.3',
        info: { title: 'practice-server', version: '1.0.0' },
    },
    apis: [
        //'./server/routes/*/api.js'
        // 照目前寫法似乎沒有使用到jsdoc，而是直接填寫open-api格式的yml，讓它讀取
        './swagger/*.yaml',
    ]
}); 

module.exports = (httpServer) => {
    httpServer.use(
        `/explorer`,
        swaggerUi.serve,
        // TODO 對於原本寫法有點疑問，為何要包成arrow funciton
        swaggerUi.setup(swaggerSpec, { swaggerOptions: { docExpansion: 'none' } })
    );
};
