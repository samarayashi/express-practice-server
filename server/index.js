// web server
const express = require('express');

// third party server middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// other third party usage
const passport = require('passport');

// self create utils
const RedisUtils = require('./services/utils/redis-util');

// config local env
result = require('dotenv').config({path: __dirname + '/../.env'});
const envUtil = require('./services/utils/env-util')
const envCache =  envUtil.envCache();
envUtil.infoEnvVar(envCache)

const httpServer = express();
const port = 3000;


// middleware hooking
httpServer.use(bodyParser.json());
httpServer.use(bodyParser.urlencoded({extended: true}));
httpServer.use(cookieParser());

// session store
const redisConfigs = {
  port: envCache.REDIS_PORT,
  host: envCache.REDIS_HOST
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
  console.log(`session object: ${JSON.stringify(req.session)}`)
  console.log(req.sessionID) 
})

//include APIs
require('./routes/index')(httpServer);

//hook wagger page
require('./boot/swagger-spec')(httpServer);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})