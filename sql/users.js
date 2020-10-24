// ?
const knex = require('../connection');

module.exports = {
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


/*
// ?
const knex = require('../connection');

module.exports = {
  getOne: function (id) {
    return knex('user').where('id', id).first();
  },

  getOneByEmail: function (email) {
    return knex('user').where('email', email).first();
  },

  create: function(user) {
    return knex('user').insert(user, 'id').then(ids => {
      return ids[0];
    });
  }

  
}
*/