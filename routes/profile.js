const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { ensureLoggedIn } = require('../auth/middleware');
const collectible = require('../models/collectible');


router.get('/', ensureLoggedIn, async (req, res, next) => {
    const userId = req.signedCookies.user_id

<<<<<<< HEAD
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
=======
    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id')
        .where('collector_id', userId );
>>>>>>> 2e7bfef01b74666f5e1c226d7559a5d9dd81acac

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

<<<<<<< HEAD
    router.post('/', async (req, res, next) => 
    {       
        const q1 = req.body.has_quantity;
        const q2 = req.body.wants_quantity;
        const q3 = req.body.willing_to_trade_quantity;
        const collectorSelected = req.body.collector_id;
        const collectible_id1 = req.body.collectible_id;
        console.log(q1);
        console.log(q2);
        console.log(q3);
        console.log(req.signedCookies.user_id);
        console.log(collectible_id1);
        await knex('collection')
            .where({collector_id: req.signedCookies.user_id})
            .andWhere({collectible_id: collectible_id1})
            .update({has_quantity: q1})
            .update({wants_quantity: q2})
            .update({willing_to_trade_quantity: q3 });

        res.render('profile', { 
            collector: collectorData,
            collector_id: req.signedCookies.user_id,
            collectionHas: collectionsHas,
            collectionWants: collectionsWants,
            collectionWillingToTrade: collectionsWillingToTrade
        });
        //   res.redirect(`/profile/submit?quantity=${has_quantity}&quantity=${wants_quantity}&quantity=${willing_to_trade_quantity}&button=Submit`);
    });

    // router.put('/submit2', async (req, res, next) => 
    // {       
    //     const q1 = req.body.has_quantity;
    //     const q2 = req.body.wants_quantity;
    //     const q3 = req.body.willing_to_trade_quantity;
    //     const collectorSelected = req.body.collector_id;
    //     const collectible_id = req.body.collectible_id;
    //     // await knex('collection').where({collector_id: 42}).andWhere({collectible_id: 5})
    //     //     .update({has_quantity: `5`,
    //     //      wants_quantity: `7`,willing_to_trade_quantity: `23`});
    //       res.redirect('profile');
    // });
    
    // router.put('/submit3', async (req, res, next) => 
    // {       
    //     const q1 = req.body.has_quantity;
    //     const q2 = req.body.wants_quantity;
    //     const q3 = req.body.willing_to_trade_quantity;
    //     const collectorSelected = req.body.collector_id;
    //     const collectible_id = req.body.collectible_id;
    //     await knex('collection').where({collector_id: collectorSelected})
    //         .join({collectible_id: collectible_id})
    //         .update({has_quantity: q1,
    //          wants_quantity: q2, willing_to_trade_quantity: q3 });
    //     return knex.raw(
    //         "UPDATE COLLECTION SET has_quantity = q1, wants_quantity = q2, willing_to_trade_quantity = q3,"
    //     )
    //          res.redirect('profile');
    //         });
    
=======
>>>>>>> 2e7bfef01b74666f5e1c226d7559a5d9dd81acac

module.exports = router;