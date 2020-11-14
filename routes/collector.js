const express = require('express');
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');



router.get('/search', async (req, res, next) => {
  const { username } = req.query;
  const collectors = await knex('collector')
    .select('collector.collector_id', 'collector.username', 'collector.email', 'collector.phone_number', 'collector.is_admin')
    .where('collector.username', 'ilike', `%${username}%`);


                // if results, render collectibles
                if (collectors.length > 0) {
                  res.render('collector', {
                    title: `Collector\'s Trading Platform | Search Results`,
                    collector: collectors});
                  return;
              }
              
              // if no results, inform user
              else {
                  res.render('collector', { 
                          title: `Collector\'s Trading Platform | Search Results`,
                          message: `No results matching your search term "${username}"`,
                          messageClass: 'alert-info'
                      }
                  )
                  return;
              }



  });

router.get('/:id', async (req, res, next) => { 
    const { id } = req.params;
    const collectors = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where({ collector_id: id });

    res.render('collectorpage', {
        title: `Collector\'s Trading Platform | ${id}`,
        collector: collectors  });
    
});

router.get('/trade/:id', async (req, res, next) => { 
    const { id } = req.params; // other collector's id
    const userId = req.signedCookies.user_id; // logged in collector's id

    // logged in user data
    const currentUser = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where('collector_id', userId).first()

    // the other collector's user data
    const otherUser = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where({ collector_id: id }).first()

    const currentUserWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', userId)
        .andWhere('wants_quantity', '>', 0)

    const otherUserWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', otherUser.collector_id)
        .andWhere('wants_quantity', '>', 0)

    const currentUserWantsCollectibleIds = []
    const otherUserWantsCollectibleIds = []
    currentUserWants.forEach((row) => currentUserWantsCollectibleIds.push(row.collectible_id))
    otherUserWants.forEach((row) => otherUserWantsCollectibleIds.push(row.collectible_id))

    const currentUserToOtherUser = await knex('collection')
        .select(['collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .where('collector_id','!=', currentUser.collector_id)
        .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)
    
    const otherUserToCurrentUser = await knex('collection')
        .select(['collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .where('collector_id','=', otherUser.collector_id)
        .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)

    res.render('trade', {
        title: `Collector\'s Trading Platform | Trade Matches with ${otherUser.username}`,
        currentUser,
        otherUser,
        currentUserCollectibles: currentUserToOtherUser,
        otherUserCollectibles: otherUserToCurrentUser,
    });

});

module.exports = router;