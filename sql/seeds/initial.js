const {
    collectibles,
    collectibleTypes,
    collections,
    collectors,
    collectorRatings,
    followers,
    matches
} = require('../dummy')

console.log(collectibleTypes)
console.log(collectors)
console.log(collectibles)

exports.seed = (knex) => {
    const collectector = knex('collector')
    .del()
    .then(() => {
        return knex('collector').insert(collectors);
    });

    const collectible_type = knex('collectible_type')
    .del()
    .then(() => {
        return knex('collectible_type').insert(collectibleTypes);
    });

    const collectible = knex('collectible')
        .del()
        .then(() => {
            return knex('collectible').insert(collectibles);
        });

    // NOTE: Order matters here.
    return Promise.all([
        collectector,
        collectible_type,
        collectible,
    ])
}