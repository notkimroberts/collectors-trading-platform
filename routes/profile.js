const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { ensureLoggedIn } = require('../auth/middleware')


router.get('/', ensureLoggedIn, async (req, res, next) => {
    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id')
        .where('collector_id', req.signedCookies.user_id );

    // user's has collectibles if has_quantity is greater than 0
    const collectionsHas = await knex('collection')
    .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
    .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
    .where('collector_id', req.signedCookies.user_id )
    .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
    .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
    .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
    .where('collector_id', req.signedCookies.user_id )
    .andWhere('collection.wants_quantity', '>', 0);


    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
    .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
    .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
    .where('collector_id', req.signedCookies.user_id )
    .andWhere('collection.willing_to_trade_quantity', '>', 0);


    res.render('profile', { 
        collector: collectorData,
        //email: email,
        //phone_number: phone_number,
        //title: `Collector's Trading Platform | ${username}`,
        //username: username,
        collector_id: req.signedCookies.user_id,
        collectionHas: collectionsHas,
        collectionWants: collectionsWants,
        collectionWillingToTrade: collectionsWillingToTrade
    });
});


module.exports = router;