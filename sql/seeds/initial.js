// const {
//     collectors,
//     collectibleTypes,
//     collectibles,
//     collections,
//     collectorRatings,
//     followers,
//     matches
// } = require('../dummy')
// TODO: Implement seeing using dummy.js

exports.seed = async (knex) => {
    const collectectorTable = knex('collector')
        .del()
        .then(() => {
            // return knex('collector').insert(collectors);
            return knex('collector').insert([
                { collector_id: 1, username: 'user1', password: 'pass1', email: 'email1@email.com', phone_number: 1234567 },
                { collector_id: 2, username: 'user2', password: 'pass2', email: 'email2@email.com', phone_number: 1234567 },
                { collector_id: 3, username: 'user3', password: 'pass3', email: 'email3@email.com', phone_number: 1234567 },
            ]);
        });

    const collectibleTypeTable = knex('collectible_type')
        .del()
        .then(() => {
            // return knex('collectible_type').insert(collectibleTypes);
            return knex('collectible_type').insert([
                { collectible_type_id: 1, name: 'cards', release_year: 1969, attribute_template: 'cards' },
            ]);
        });

    const collectibleTable = knex('collectible')
        .del()
        .then(() => {
            // return knex('collectible').insert(collectibles);
            return knex('collectible').insert([
                { collectible_id: 1, collectible_type_id: 1, name: 'test1', image_url: 'test1', total_quantity: 5 },
                { collectible_id: 2, collectible_type_id: 1, name: 'test2', image_url: 'test2', total_quantity: 5 },
                { collectible_id: 3, collectible_type_id: 1, name: 'test3', image_url: 'test3', total_quantity: 5 },
            ]);
        });

    const collectorRatingsTable = knex('collector_ratings')
        .del()
        .then(() => {
            // return knex('collector_ratings').insert(collectorRatings);
            return knex('collector_ratings').insert([
                { from_user_id: 1, to_user_id: 2, rating: 5 },
                { from_user_id: 2, to_user_id: 3, rating: 4 },
                { from_user_id: 3, to_user_id: 1, rating: 3 },
            ]);
        });

    const collectionTable = knex('collection')
        .del()
        .then(() => {
            // return knex('collection').insert(collections);
            return knex('collection').insert([
                { collector_id: 1, collectible_id: 1, has_quantity: 1, willing_to_trade_quantity: 2, wants_quantity: 0 },
                { collector_id: 2, collectible_id: 2, has_quantity: 2, willing_to_trade_quantity: 1, wants_quantity: 1 },
                { collector_id: 3, collectible_id: 3, has_quantity: 3, willing_to_trade_quantity: 0, wants_quantity: 2 },
            ]);
        });

    const followersTable = knex('followers')
        .del()
        .then(() => {
            // return knex('followers').insert(followers);
            return knex('followers').insert([
                { collector_id: 1, following_collector_id: 2 },
                { collector_id: 1, following_collector_id: 3 },
                { collector_id: 2, following_collector_id: 1 },
                { collector_id: 3, following_collector_id: 2 },
            ]);
        });

    const matchTable = knex('match')
        .del()
        .then(() => {
            // return knex('match').insert(matches);
            return knex('match').insert([
                { match_id: 1, from_collector_id: 1, to_collector_id: 2, collectible_id: 1, match_executed: true },
                { match_id: 2, from_collector_id: 2, to_collector_id: 3, collectible_id: 1, match_executed: false },
            ]);
        });

    // NOTE: Order matters here.
    await collectectorTable
    await collectibleTypeTable
    await collectibleTable
    await collectorRatingsTable
    await collectionTable
    await followersTable
    await matchTable
}