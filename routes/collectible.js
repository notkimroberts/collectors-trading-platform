const express = require('express');
const FileType = require('file-type');
const knex = require('../connection')
const router = express.Router();


router.get('/', async (req, res, next) => { 
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
  
        // filter by type
    const collectiblesByType = await knex('collectible_type')
        .select('name as type_name', 'collectible_type_id as type_id');
   
        res.render('collectible', {
        title: "Collector\'s Trading Platform | Collectibles",
        collectible: collectibles,
        collectibleByType: collectiblesByType,
    });
});

 // Display all collectibles from a given a type
 router.get('/filter/:type_id', async (req, res, next) => {
    const { type_id } = req.params;
    const clearfilter = 1;
  
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .where('collectible.collectible_type_id', type_id);
 
    // filter by type
    const collectiblesByType = await knex('collectible_type')
        .select('name as type_name', 'collectible_type_id as type_id');
 
        res.render('collectible', {
        title: "Collector\'s Trading Platform | Collectibles",
        collectible: collectibles,
        collectibleByType: collectiblesByType,
        clearfilter: clearfilter
    });
});

router.get('/search', async (req, res, next) => {
    const { name } = req.query;
    const nofilter = 1; // to not display dropdown
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .where('collectible.name', 'ilike', `%${name}%`);
        
            // if results, render collectibles
            if (collectibles.length > 0) { //if something in the query
                res.render('collectible', {
                title: "Collector\'s Trading Platform | Search Results",
                collectible: collectibles,
                nofilter: nofilter,
                });
                return;
            }
            
            // if no results, inform user
            else { //the query returned nothing
                res.render('collectible', { 
                        title: "Collector\'s Trading Platform | Search Results",
                        message: `No results matching your search term "${name}"`,
                        messageClass: 'alert-info',
                        nofilter: nofilter,
                    }
                )
                return;
            }   
});

router.get('/:id', async (req, res, next) => { 
    const { id } = req.params;
    const nofilter = 1; // to not display dropdown
   
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .where({ collectible_id: id });


    // filter by type
    const collectiblesByType = await knex('collectible_type')
        .select('name as type_name', 'collectible_type_id as type_id');


        res.render('collectiblepage', {
        title: `Collector\'s Trading Platform | ${id}`,
        collectible: collectibles,
        collectibleByType: collectiblesByType,
        nofilter: nofilter, // to not display filter
    });
    
});


router.post('/:id', async (req, res, next) => 
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
});

router.get('/image/:id', async (req, res, next) => { 
    const id = req.params.id;
 
    const collectible = await knex('collectible').where({ collectible_id: id }).first();
    
    if (collectible) {
        const contentType = await FileType.fromBuffer(collectible.image);
        res.type(contentType.mime);
        res.end(collectible.image);
    } else {
        res.end('No image with that id!');
    }
});


module.exports = router;