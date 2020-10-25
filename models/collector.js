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
      },
    getOne: function (collector_id) {
        return knex('collector').where('collector_id', collector_id).first();
      },
    
      getOneByEmail: function (email) {
        return knex('collector').where('email', email).first();
      },
      
      getOneByUsername: function (username) {
        return knex('collector').where('username', username).first();
      },
      
      create: function(collector) {
        return knex('collector').insert(collector, 'collector_id').then(ids => {
          return ids[0];
        });
      }
}
