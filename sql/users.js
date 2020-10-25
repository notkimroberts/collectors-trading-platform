onst knex = require('../connection');

// https://www.youtube.com/watch?v=H7qkTzxk_0I
module.exports = {
  
  // function that takes a collector_id and returns the first collector with a matching collector_id
  getOne: function (collector_id) {
    return knex('collector').where('collector_id', collector_id).first();
  },

  // function that takes an email and returns the first collector with a matching email
  getOneByEmail: function (email) {
    return knex('collector').where('email', email).first();
  },
  
  // function that takes a username and returns the first collector with a matching username
  getOneByUsername: function (username) {
    return knex('collector').where('username', username).first();
  },
   
  // function that takes a collector and inserts into it
  create: function(collector) {
    return knex('collector').insert(collector, 'collector_id').then(ids => {
      return ids[0];
    });
  }


  
}
