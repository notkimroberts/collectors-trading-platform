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

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', id );

    const wantsPublic = await knex('collector')
        .select('wants_public')
        .where('wants_public', 'true')
        .where('collector_id', id );

    const hasPublic = await knex('collector')
        .select('has_public')
        .where('has_public', 'true')
        .where('collector_id', id );

    // user's has collectibles if has_quantity is greater than 0
    const collectionsHas = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', id )
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', id )
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .where('collector_id', id )
        .andWhere('collection.willing_to_trade_quantity', '>', 0);

    const userWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', id)
        .andWhere('wants_quantity', '>', 0)

    const userWantsCollectibleIds = []
    userWants.forEach((row) => userWantsCollectibleIds.push(row.collectible_id))

    const matches = await knex('collection')
        .select(['collection.collector_id', 'collector.username','collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collector', 'collection.collector_id', 'collector.collector_id')
        .where('collector.collector_id', '!=', id)
        .whereIn('collection.collectible_id', userWantsCollectibleIds)
        .andWhere('collection.willing_to_trade_quantity', '>', 0)

    var showHas = null;
    var showWants = null;
    var showTrade = null;

    var showWantsPublic = null;
    var showHasPublic = null;

    var isLoggedInUser = null;

    // if results, render collectibles
    if (wantsPublic.length > 0) {
        showWantsPublic = 1;
    }

    // if results, render collectibles
    if (hasPublic.length > 0) {
        showHasPublic = 1;
    }
    
    // if results, render collectibles
    if (collectionsHas.length > 0) {
        showHas = 1;
    }

    // if results, render collectibles
    if (collectionsWants.length > 0) {
        showWants = 1;
    }

    // if results, render collectibles
    if (collectionsWillingToTrade.length > 0) {
        showTrade = 1;
    }

    if (id == req.signedCookies.user_id) {
        isLoggedInUser = 1;
    }

    res.render('collectorpage', { 
        title: `Collector\'s Trading Platform | ${id}`,
        collector: collectorData,
        collector_id: id,
        collectionHas: collectionsHas,
        collectionWants: collectionsWants,
        collectionWillingToTrade: collectionsWillingToTrade,
        showHas,
        showWants,
        showTrade,
        showHasPublic,
        showWantsPublic,
        isLoggedInUser
    });
});

router.get('/trade/:id', async (req, res, next) => {
    const currentUserId = req.signedCookies.user_id
    const otherUserId = req.params.id

    if (otherUserId === currentUserId) {
        res.redirect('/profile')
    }

    // logged in user data
    const currentUser = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where('collector_id', currentUserId).first()

    // the other collector's user data
    const otherUser = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where({ collector_id: otherUserId }).first()

    const currentUserWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', currentUserId)
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
        .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id','=', currentUserId)
        .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)
    
    const otherUserToCurrentUser = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id','=', otherUserId)
        .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)

    res.render('trade', {
        title: `Collector\'s Trading Platform | Trade Matches with ${otherUser.username}`,
        currentUser,
        otherUser,
        currentUserCollectibles: currentUserToOtherUser,
        otherUserCollectibles: otherUserToCurrentUser,
    });



router.get('/trade/images/:id', async (req, res, next) => {
        const currentUserId = req.signedCookies.user_id
        const otherUserId = req.params.id
    
        if (otherUserId === currentUserId) {
            res.redirect('/profile')
        }
    
        // logged in user data
        const currentUser = await knex('collector')
            .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
            .where('collector_id', currentUserId).first()
    
        // the other collector's user data
        const otherUser = await knex('collector')
            .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
            .where({ collector_id: otherUserId }).first()
    
        const currentUserWants = await knex('collection')
            .select(['collectible_id'])
            .where('collector_id', '=', currentUserId)
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
            .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
            .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
            .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
            .where('collector_id','=', currentUserId)
            .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
            .andWhere('willing_to_trade_quantity', '>', 0)
        
        const otherUserToCurrentUser = await knex('collection')
            .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
            .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
            .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
            .where('collector_id','=', otherUserId)
            .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
            .andWhere('willing_to_trade_quantity', '>', 0)
    
        res.render('tradeimages', {
            title: `Collector\'s Trading Platform | Trade Matches with ${otherUser.username}`,
            currentUser,
            otherUser,
            currentUserCollectibles: currentUserToOtherUser,
            otherUserCollectibles: otherUserToCurrentUser,
        });
});

});

module.exports = router;