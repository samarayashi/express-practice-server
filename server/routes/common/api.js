'use strict';
const logger = require('../../services/utils/winston-util').logger;
const passport = require('passport');
const Auth = require('../../middlewares/signin-checker');
// const redisUtil = require('../../services/utils/redis-util');

module.exports = (httpServer) => {
  const router = require('express').Router();

  // User
  // elearning-admin/api/common/login
  // have some problem doesn't login success
  // 驗證有通過所以可以拿到user,
  // 但是登入機制要幫我處理的req.user is undefind
  // passport.authenticate 若不是放在middleware的話，似乎要自己調用req.login()
  /*參考
  passport.authenticate callback not being executed : https://stackoverflow.com/questions/47140332/passport-authenticate-callback-not-being-executed
  Express Passport (node.js) error handling:  https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
  authenticate in Middleware: http://www.passportjs.org/concepts/authentication/middleware/
  req.login(): https://www.passportjs.org/concepts/authentication/login/
  */
  /*
  router.post('/login', (req, res) => {
    passport.authenticate('fakeDBUserCheck', function(err, user, info) {
      if (err) {
        logger.error('login failed with error : ', err);
        return res.status(err.code).json({code: err.code, message: err.message}).end();
      } else if (!user) {
        return res.status(401).json({code: 401, message: 'login failed, please check your username and password.'}).end();
      } else {
		console.log('login success')
        return res.json({code: 200, data: req.user}).end();
      }
    })(req, res);
  });
*/

  // User
  // elearning-admin/api/common/login
  // 放在middleware, 可成功執行
  /*
  router.post('/login', 
    passport.authenticate('fakeDBUserCheck'),
    (req, res) => {
        return res.json({code: 200, data: req.user}).end();
      });
  */

  router.post('/login', (req, res, next) => {
    passport.authenticate('fakeDBUserCheck', function(err, user, info) {
      if (err) {
        logger.error('login failed with error : ', err);
        return res.status(err.code).json({code: err.code, message: err.message}).end();
      } else if (!user) {
        return res.status(401).json({code: 401, message: 'login failed, please check your username and password.'}).end();
      } else {
        logger.debug('login success')
        req.login(user, loginErr => {
          if (loginErr){
            return next(loginErr)
          }
          return res.json({code: 200, data: req.user}).end();
        })
        
      }
    })(req, res, next);
  });

  // elearning-admin/api/common/logout
  router.post('/logout', async (req, res) => {
    if (!req || !req.user) {
      return res.status(204).json({code: 204, message: 'logout failed'});
    }
    req.logout();
    req.session.destroy();
    return res.status(200).json({code: 200, message: 'logout successed'});
  });

  // elearning-admin/api/common/getPermission
  router.get('/getPermission', Auth.apiCheckBS, (req, res) => {
    return res.json({code: 200, data: req.user.permission}).end();
  });


  return router;
};

