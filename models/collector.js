const knex = require('../connection')

//knex queries for collector
module.exports = {
    create: function(collector) {
        return knex('collector').insert(collector, 'collector_id').then(ids => {
          return ids[0];
        });
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