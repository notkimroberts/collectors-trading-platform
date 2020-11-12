const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { ensureLoggedIn } = require('../auth/middleware');
const collectible = require('../models/collectible');


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
        .andWhere('wants_quantity', '>', 0);

    const userWantsCollectibleIds = []
    userWants.forEach((row) => userWantsCollectibleIds.push(row.collectible_id))

    const matches = await knex('collection')
        .select(['collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .where('collector_id', '!=', userId)
        .whereIn('collection.collectible_id', userWantsCollectibleIds)
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

    router.post('/', async (req, res, next) => { 
        const userId = req.signedCookies.user_id;   
        const q1 = req.body.has_quantity;
        const q2 = req.body.wants_quantity;
        const q3 = req.body.willing_to_trade_quantity;
        const collectible_id1 = req.body.collectible_id;

        const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id')
        .where('collector_id', userId );

    const collectibles = await knex('collectible')
    .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
    .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
    .where({ collectible_id: collectible_id1 });

        // user's has collectibles for any value zero or greater
        const collectionsHas = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .where('collection.collectible_id', collectible_id1  )
        .andWhere('collection.has_quantity', '>=', 0);

        // user's wants collectibles if has_quantity for any value zero or greater
        const collectionsWants = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .where('collection.collectible_id', collectible_id1 )
        .andWhere('collection.wants_quantity', '>=', 0);

        // user's willing to trade collectibles if willing_to_trade_quantity for any value zero or greater
        const collectionsWillingToTrade = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', userId )
        .where('collection.collectible_id', collectible_id1 )
        .andWhere('collection.willing_to_trade_quantity', '>=', 0);

        // see if there's already a collector_id and collectible_id pair in the table
        const collectionExists = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', userId)
        .where('collectible_id', collectible_id1);

    

        const collection = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', userId);

        console.log(q1);
        console.log(q2);
        console.log(q3);
        console.log(userId);
        console.log(collectible_id1);

        // I wrap knex as 'connection'
        const queries = [];
     knex.transaction( trx => {
         const queries = [];
         const updateAll = collection.forEach(async (req, res, next)=> {
                await knex('collection') 
                    .where({collector_id: userId})
                    .andWhere({collectible_id: collectible_id1})
                    .update({has_quantity: q1})
                    .update({wants_quantity: q2})
                    .update({willing_to_trade_quantity: q3 })
                    // .transacting(trx); // This makes every update be in the same transaction
                    // queries.push();

            });

            Promise.all(queries) // Once every query is written
                // .then(() => trx.commit) // We try to execute all of them
                // .catch(() => trx.rollback); // And rollback in case any of them goes wrong
          
            res.render('profile', { 
                collector: collectorData,
                collector_id: req.signedCookies.user_id,
                collectionHas: collectionsHas,
                collectionWants: collectionsWants,
                collectionWillingToTrade: collectionsWillingToTrade,
        });
        });
    });
module.exports = router;