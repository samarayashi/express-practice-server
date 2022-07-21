const { isUndefined } = require('lodash');
const _ = require('lodash')
const DB = require('../../fakeDBData')

module.exports = {
    fakeDBLogin:  async (username, password) =>{
        try {
            const users = DB.users;
            const user = _.find(users, { 'name': username, 'password': password });
            if(isUndefined(user)){
                throw {
                    code: 401,
                    message: 'FakeDB Login failed',
                }
            } else{
                return { code: 200, data: user}
            }
        } catch (err) {
            return {code: err.code||400, message: err.message}
        }
}
}