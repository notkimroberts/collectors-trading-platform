const knex = require('../connection')


module.exports = {
    create: (username, password, email, phone_number) => {
        const collector = knex('collector')
        .then(() => {
            return knex('collector').insert([
                { username: username, password: password, email: email, phone_number: phone_number },
            ])
        })
        return Promise.all([collector])
    },
    getById: (collector_id) => knex('collector').where('collector_id', collector_id).first(),
    getByEmail: (email) => {
        return knex('collector').where('email', email).first()
    },
    getByEmailAndPassword: (email, hashedPassword) => {
        return knex('collector').where('email', email).andWhere('password', hashedPassword).first()
    },
    getByUsername: (username) => knex('collector').where('username', username).first(),

    
    getAll(query) {
        const knexQuery = knex('collector');

        if (query.username) {
            knexQuery.where('username', 'ilike', `%${query.username}%`);
        }

        return knexQuery;
    }
}