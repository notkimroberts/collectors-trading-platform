const knex = require('../connection')


module.exports = {
    create: (collectible) => knex('collectible').insert(collectible, 'collectible_id').returning('collectible_id').then(ids => ids[0]),
    getById: (collectible_id) => knex('collectible').where('collectible_id', collectible_id).first(),
    getByName: (name) => knex('collectible').where('name', name).first(),
}