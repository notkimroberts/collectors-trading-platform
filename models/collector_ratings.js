const knex = require('../connection')

module.exports = {
    create: (fromUser, toUser, stars, comment) => {
    const Collector_ratings = knex('collector_ratings')
    .then(() => {
        return knex('collector_ratings').insert([
            { from_user_id: fromUser, to_user_id: toUser, rating: stars, comment: comment},
        ])
    })
    return Promise.all([Collector_ratings])
}
}