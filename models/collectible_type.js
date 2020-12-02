const knex = require('../connection')

//knex queries for collectible type
module.exports = {
    getById: (collectible_type_id) => knex('collectible_type').where('collectible_type_id', collectible_type_id).first() 
}