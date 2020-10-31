const knex = require('../connection')


module.exports = {
    create: (collectible) => knex('collectible').insert(collectible, 'collectible_id').returning('collectible_id').then(ids => ids[0]),
    getById: (collectible_id) => knex('collectible').where('collectible_id', collectible_id).first(),
    getByName: (name) => knex('collectible').where('name', name).first(),
    // searchByCollectibleID(query) {
    //     if (query.collectible_id){
    //         knex('collectible').select().then(function(collector_id){
    //         collectible_id=collector_id
    //         return knex('collector').select()}).then(
    //             return knex('collector');
    //       })
    //     }
    //   },
    getAll(query) {
        const knexQuery = knex('collectible');

        if (query.name) {
            knexQuery.where('name', 'like', `%${query.name}%`);
        }
        return knexQuery;
    }
}