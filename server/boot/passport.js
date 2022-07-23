const passport = require('passport');
const logger = require('../services/utils/winston-util').logger;
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash')

const externalService = require('../services/external-service');
const DB = require('../../fakeDBData')


module.exports = (httpServer) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        user = _.find(DB.users, {id: id});
        done(null, user);
    });

    passport.use( 
        'fakeDBUserCheck',
        new LocalStrategy({
            // 改以名為 username 的欄位資訊作為帳號(預設req.body.username)
            usernameField: 'username',
            // 改以名為 password 的欄位資訊作為密碼(預設req.body.password)
            passwordField: 'password',
            // 讓 varify callback 函式可以取得 req 物件
            passReqToCallback: true 
            },
            async (req, username, password, done) => {
                try{
                    let loginResult = await externalService.fakeDBLogin(username, password);
                    if (loginResult.code === 200){
                        const user = loginResult.data
                        //update session
                        // req.name = user.name;
                        // req.group_id = user.group_id;
                        // req.emp_no = user.emp_no;
                        return done(null, user)
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


