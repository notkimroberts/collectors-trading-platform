const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { ensureLoggedIn } = require('../auth/middleware');
const collectible = require('../models/collectible');


/* router.get('/', async (req, res, next) => {
    //const { email, phone_number, username, collector_id} = req.user;
    localStorage.getItem('collector');
    console.log(collector);

    res.render('profile', { 
        //email: email,
        //phone_number: phone_number,
        //title: `Collector's Trading Platform | ${username}`,
        //username: username,
        //collector_id: collector_id
    }); 
}); */

    router.get('/', ensureLoggedIn, async (req, res, next) => {
        // const { id } = req.params;
        //console.log(user_id);
        //const { email, phone_number, username, collector_id} = res.collector_id;
        console.log(req.signedCookies.user_id); // gets collector_id

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


        console.log(collectorData);
    
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

    router.post('/submit', async (req, res, next) => 
    {       
        const q1 = req.body.has_quantity;
        const q2 = req.body.wants_quantity;
        const q3 = req.body.willing_to_trade_quantity;
        const collectorSelected = req.body.collector_id;
        const collectible_id = req.body.collectible_id;
        await knex('collection').where({collectible_id: 5}).where({collector_id: 42})
            .update({has_quantity: 3,
             wants_quantity: 5,willing_to_trade_quantity:23});
             res.redirect(req.get('profile'));
    });

    router.post('/submit2', async (req, res, next) => 
    {       
        const q1 = req.body.has_quantity;
        const q2 = req.body.wants_quantity;
        const q3 = req.body.willing_to_trade_quantity;
        const collectorSelected = req.body.collector_id;
        const collectible_id = req.body.collectible_id;
        await knex('collection').where({collector_id: collectorSelected})
            .update({has_quantity: q1,
             wants_quantity: q2,willing_to_trade_quantity: q3 });
             res.redirect('profile');
    });
    
    router.post('/submit3', async (req, res, next) => 
    {       
        const q1 = req.body.has_quantity;
        const q2 = req.body.wants_quantity;
        const q3 = req.body.willing_to_trade_quantity;
        const collectorSelected = req.body.collector_id;
        const collectible_id = req.body.collectible_id;
        await knex('collection').where({collector_id: collectorSelected})
            .join({collectible_id: collectible_id})
            .update({has_quantity: q1,
             wants_quantity: q2, willing_to_trade_quantity: q3 });
        return knex.raw(
            "UPDATE COLLECTION SET has_quantity = q1, wants_quantity = q2, willing_to_trade_quantity = q3,"
        )
             res.redirect('profile');
            });
    

module.exports = router;