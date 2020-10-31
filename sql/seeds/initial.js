const {
    collectors,
    collectibleTypes,
    collectibles,
    collections,
    collectorRatings,
    followers,
    matches
} = require('../dummy')


exports.seed = async (knex) => {
    const collectectorTable = await knex('collector')
        .del()
        .then(() => {
            return knex('collector').insert(collectors);
        });

    const collectibleTypeTable = await knex('collectible_type')
        .del()
        .then(() => {
            return knex('collectible_type').insert(collectibleTypes);
        });

    const collectibleTable = await knex('collectible')
        .del()
        .then(() => {
            return knex('collectible').insert(collectibles);
        });

    const collectorRatingsTable = await knex('collector_ratings')
        .del()
        .then(() => {
            return knex('collector_ratings').insert(collectorRatings);
        });

    const collectionTable = await knex('collection')
        .del()
        .then(() => {
            return knex('collection').insert(collections);
        });

    const followersTable = await knex('followers')
        .del()
        .then(() => {
            return knex('followers').insert(followers);
        });

    const matchTable = await knex('match')
        .del()
        .then(() => {
            return knex('match').insert(matches);
        });
}