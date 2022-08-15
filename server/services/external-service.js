const _ = require('lodash')
const {db, models} = require('../rds/db-index')

module.exports = {
    memberLogin:  async (account, password) =>{
        try {
            let member = await models.member.findOne(account, password)
            if(!member){
                throw {
                    code: 401,
                    message: 'member login failed',
                }
            } else {
                return { code: 200, data: member}
            }
        } catch (err) {
            return {code: err.code||400, message: err.message}
        }
}
}