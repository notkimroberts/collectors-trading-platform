const {
    collectibles,
    collectibleTypes,
    collections,
    collectors,
    collectorRatings,
    followers,
    matches
} = require('../dummy')

console.log(collectors)
console.log(collections)

exports.seed = (knex) => {
    const collectectorTable = knex('collector')
        .del()
        .then(() => {
            return knex('collector').insert(collectors);
        });

    const collectibleTypeTable = knex('collectible_type')
        .del()
        .then(() => {
            return knex('collectible_type').insert(collectibleTypes);
        });

    // const collectibleTable = knex('collectible')
    //     .del()
    //     .then(() => {
    //         return knex('collectible').insert(collectibles);
    //     });

    const collectionTable = knex('collection')
        .del()
        .then(() => {
            return knex('collection').insert(collections);
        });

    // const collectorRatingsTable = knex('collector_ratings')
    //     .del()
    //     .then(() => {
    //         return knex('collector_ratings').insert(collectorRatings);
    //     });

    // const followersTable = knex('followers')
    //     .del()
    //     .then(() => {
    //         return knex('followers').insert(followers);
    //     });

    // const matchTable = knex('match')
    //     .del()
    //     .then(() => {
    //         return knex('match').insert(matches);
    //     });

    // NOTE: Order matters here.
    return Promise.all([
        collectectorTable,
        collectibleTypeTable,
        // collectibleTable,
        collectionTable,
        // collectorRatingsTable,
        // followersTable,
        // matchTable,
    ])
}