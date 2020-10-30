const knex = require('../connection')

module.exports = {

    getOne: function (collectible_type_id) {
        return knex('collectible_type').where('collectible_type_id', collectible_type_id).first();
      }
    
        
}
