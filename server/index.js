//node
const fs = require('fs');

// web server
const express = require('express');

// third party server middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// config local env
let envFilePath = __dirname + '/../.env';
if (fs.existsSync(envFilePath)){
 require('dotenv').config({path: envFilePath});
}
require('./services/utils/env-util.js').infoEnvVars()



// other third party usage
const passport = require('passport');
const logger = require('./services/utils/winston-util.js').logger;

// self create utils
const RedisUtils = require('./services/utils/redis-util.js');

//DB instance
(async function() {
  await require('./rds/db-connector').func_ConnectDB();
})();


const httpServer = express();
const port = process.env.EXPRESS_PORT || 3000;


// middleware hooking
httpServer.use(bodyParser.json());
httpServer.use(bodyParser.urlencoded({extended: true}));
httpServer.use(cookieParser());

// session store
const redisConfigs = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST||'localhost'
}
const RedisSessionClient = RedisUtils.createClient(redisConfigs, 'RedisSessionClient');

httpServer.use(
    session({
        store: new RedisStore({
          client: RedisSessionClient,
          ttl: 4 * 3600,
          prefix: 'practice-server',
          disableTouch: true
        }),
        // genid: now use default method to generate sid
        secret: 'mySecret',
        resave: false, // 不太理解先隨便設
        saveUninitialized: false,
        name: 'practice-server-session'
    })
);

// init passport
httpServer.use(passport.initialize());
httpServer.use(passport.session());
const passportInit = require('./boot/passport')();


// index page
httpServer.get('/', (req, res) => {
  res.write('Hello express!\n');
  res.write('My session id: ' + req.sessionID);
  res.end()
  logger.debug(`session object: ${JSON.stringify(req.session)}`)
  logger.debug(req.sessionID) 
})

//include APIs
require('./routes/index')(httpServer);

//hook wagger page
require('./boot/swagger-spec')(httpServer);

httpServer.listen(port, '0.0.0.0', () => {
  logger.info(`Example app listening on port ${port}`)
})