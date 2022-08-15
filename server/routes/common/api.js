'use strict';
const logger = require('../../services/utils/winston-util').logger;
const passport = require('passport');
const Auth = require('../../middlewares/signin-checker');


module.exports = (httpServer) => {
  const router = require('express').Router();
  
  // /api/common/login
  router.post('/login', (req, res, next) => {
    passport.authenticate('memberLogin', function(err, user, info) {
      if (err) {
        logger.error('login failed with error : ', err);
        return res.status(err.code).json({code: err.code, message: err.message}).end();
      } else if (!user) {
        return res.status(401).json({code: 401, message: 'login failed, please check your username and password.'}).end();
      } else {
        // passport.authenticate不是放在middle ware就要手動帶user進去login
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

  // /api/common/logout
  router.post('/logout', async (req, res) => {
    if (!req || !req.user) {
      return res.status(204).json({code: 204, message: 'logout failed'});
    }
    req.logout();
    req.session.destroy();
    return res.status(200).json({code: 200, message: 'logout successed'});
  });

  // /api/common/getPermission
  router.get('/getPermission', Auth.checkLogin, (req, res) => {
    return res.json({code: 200, data: req.member.permission}).end();
  });


  return router;
};

