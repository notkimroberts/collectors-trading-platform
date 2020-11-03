const express = require('express');
const knex = require('../connection')
const router = express.Router();
const { requireAuth } = require('../utils')


router.get('/', requireAuth, async (req, res, next) => {
    const { email, phone_number, username, collector_id} = req.user;
    res.render('profile', { 
        email: email,
        phone_number: phone_number,
        title: `Collector's Trading Platform | ${username}`,
        username: username,
        collector_id: collector_id
    });
});



    router.get('/:id', requireAuth, async (req, res, next) => {
        const { id } = req.params;
        const { email, phone_number, username, collector_id} = req.user;
        const collections = await knex('collection')
        .select('wants_quantity', 'has_quantity', 'willing_to_trade_quantity')
        .where({ collector_id: collector_id })
        .andWhere( {collectible_id: id });
    
        console.log(collections);
    
        res.render('profile', { 
            collection: collections,
        });
    });

    

module.exports = router;