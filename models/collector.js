const knex = require('../connection')

module.exports = {
    createUser: (username, password, email, phone_number) => {
        const collector = knex('collector')
        .then(() => {
            return knex('collector').insert([
                { username: username, password: password, email: email, phone_number: phone_number },
            ])
        })
        return Promise.all([collector])
    }
}