const knex = require('../connection')

module.exports = {
    createUser: function(is_admin, username, password, fullname, contact_email, phone_number){
        return knex('collector').insert({is_admin, username, password, fullname, contact_email, phone_number})
    }
}