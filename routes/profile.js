const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { ensureLoggedIn } = require('../auth/middleware')


router.get('/', ensureLoggedIn, async (req, res, next) => {
    const userId = req.signedCookies.user_id

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id')
        .where('collector_id', userId );

    // user's has collectibles if has_quantity is greater than 0
    const collectionsHas = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .andWhere('collection.willing_to_trade_quantity', '>', 0);

    const userWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', userId)
        .andWhere('wants_quantity', '>', 0)

    const userWantsCollectibleIds = []
    userWants.forEach((row) => userWantsCollectibleIds.push(row.collectible_id))

    const matches = await knex('collection')
        .select('*')
        .where('collector_id', '!=', userId)
        .whereIn('collectible_id', userWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)

    res.render('profile', { 
        collector: collectorData,
        collector_id: req.signedCookies.user_id,
        collectionHas: collectionsHas,
        collectionWants: collectionsWants,
        collectionWillingToTrade: collectionsWillingToTrade,
        matches
    });
});


module.exports = router;