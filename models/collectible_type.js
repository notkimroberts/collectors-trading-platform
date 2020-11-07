const knex = require('../connection')


module.exports = {
    getById: (collectible_type_id) => knex('collectible_type').where('collectible_type_id', collectible_type_id).first()

}