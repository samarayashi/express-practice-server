

// request middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// web server
const express = require('express');
const passport = require('passport');
const session = require('express-session');


const httpServer = express()
const port = 3000


// middleware hooking
httpServer.use(bodyParser.json());
httpServer.use(bodyParser.urlencoded({ extended: true }));
httpServer.use(cookieParser());

//session store
//skip redis part 
httpServer.use(
    session({
        // store: maybe will store in redis,
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