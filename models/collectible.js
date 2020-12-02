const knex = require('../connection')

//knex queries for collectibles
module.exports = {
    create: (collectible) => knex('collectible').insert(collectible, 'collectible_id').returning('collectible_id').then(ids => ids[0]),
    update: (collectible_id) => knex('collectible').where('collectible_id', collectible_id).first().update(collectible, 'collectible_id').then(ids => ids[0]),
    getById: (collectible_id) => knex('collectible').where('collectible_id', collectible_id).first(),
    getByName: (name) => knex('collectible').where('name', name).first(),
    getAll(query) {
        const knexQuery = knex('collectible');

        if (query.name) {
            knexQuery.where('name', 'ilike', `%${query.name}%`);
        }
        return knexQuery;
    }
}