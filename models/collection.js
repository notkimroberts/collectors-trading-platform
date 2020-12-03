const knex = require('../connection')

//knex queries for collection
module.exports = {
    create: (collector_id, collectible_id, has_quantity, wants_quantity, willing_to_trade_quantity) => {
        const collection = knex('collection')
        .then(() => {
            return knex('collection').insert([
                { collector_id: collector_id, collectible_id: collectible_id, has_quantity: has_quantity, wants_quantity: wants_quantity, willing_to_trade_quantity: willing_to_trade_quantity, created_at: knex.fn.now()},
            ])
        })
        return Promise.all([collection])
    }
}