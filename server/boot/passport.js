const passport = require('passport');
const logger = require('../services/utils/winston-util').logger;
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash')

const externalService = require('../services/external-service');
const {db, models} = require('../rds/db-index')


module.exports = (httpServer) => {
    passport.serializeUser(function(member, done) {
        done(null, member.member_id);
    });
    
    passport.deserializeUser(function(member_id, done) {
        member = models.member.findOne({member_id});
        done(null, member);
    });

    passport.use( 
        'memberLogin',
        new LocalStrategy({
            // 改以名為 username 的欄位資訊作為帳號(預設req.body.username)
            usernameField: 'account',
            // 改以名為 password 的欄位資訊作為密碼(預設req.body.password)
            passwordField: 'password',
            // 讓 varify callback 函式可以取得 req 物件
            passReqToCallback: true 
            },
            async (req, account, password, done) => {
                try{
                    let loginResult = await externalService.memberLogin(account, password);
                    if (loginResult.code === 200){
                        const member = loginResult.data
                        return done(null, member)
                    } else {
                        return done(null, false, { message: 'Incorrect login.' })
                    }
                }
                catch (e) {
                    logger.error(`${e.message}`);
                    return done(e);
                }
            }
        )
    );
}


