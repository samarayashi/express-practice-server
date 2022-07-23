'use strict';
const logger = require('../services/utils/winston-util').logger;
const checker = {};


const bs = function(req, res) {
    // 這邊不作補償登入, 不行就是不行, 不要幫忙登入
    // session check
    logger.debug('驗證是否通過' + req.isAuthenticated());
    return req.isAuthenticated(); // true or false
}

// BS
checker.pageCheckSignin = async (req, res, next) => {
    // 這支驗證req 已經經過 passport 檢查; 如果沒有, 導登入頁 (page)
    if(bs(req,res)) {
        return next();
    }else{
        logger.info(`因為 bs() failed, 所以 redirect /${Constant.ROOTPATH}/signin`);
        return res.redirect(`/${Constant.ROOTPATH}/user/signin`);
    }
}
checker.apiCheckBS = async (req, res, next) => {
    // 這支驗證req 已經經過 passport 檢查; 如果沒有, 401 (api)
    if(bs(req,res)) {
        return next();
    }else{
        return res.status(401).json({code:401, message: 'Unauthorized, not login'}).end();
    }
}
// BS end

module.exports = checker;
