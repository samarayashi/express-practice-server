'use strict';
const logger = require('../services/utils/winston-util').logger;
const checker = {};

checker.checkLoginRedirect = async (req, res, next) => {
    let login = req.isAuthenticated(); // true or false
    logger.debug('驗證是否通過' + login);
    if(login) {
        return next();
    }else{
        logger.info(`check login failed, 所以重新導向登入頁`);
        //目前先倒回index
        return res.redirect(`/`);
    }
}
checker.checkLogin = async (req, res, next) => {
    let login = req.isAuthenticated(); // true or false
    logger.debug('驗證是否通過' + login);
    if(login) {
        return next();
    }else{
        return res.status(401).json({code:401, message: 'Unauthorized, not login'}).end();
    }
}

module.exports = checker;
