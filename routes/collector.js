const express = require('express');
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');
const { ensureLoggedIn } = require('../auth/middleware')



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

    const tradesPublic = await knex('collector')
        .select('trades_public')
        .where('trades_public', 'true')
        .where('collector_id', id );

    // user's has collectibles if has_quantity is greater than 0
    const collectionsHas = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.willing_to_trade_quantity', '>', 0);

    const userWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', id)
        .andWhere('wants_quantity', '>', 0)

    const userWantsCollectibleIds = []
    userWants.forEach((row) => userWantsCollectibleIds.push(row.collectible_id))

    var showHas = null;
    var showWants = null;
    var showTrade = null;

    var showHasPublic = null;
    var showWantsPublic = null;
    var showTradesPublic = null;

    var isLoggedInUser = null;

    // if results, render collectibles
    if (hasPublic.length > 0) {
            showHasPublic = 1;
        }

    if (wantsPublic.length > 0) {
        showWantsPublic = 1;
    }

    if (tradesPublic.length > 0) {
        showTradesPublic = 1;
    }
    
    if (collectionsHas.length > 0) {
        showHas = 1;
    }

    if (collectionsWants.length > 0) {
        showWants = 1;
    }

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
        showTradesPublic,
        isLoggedInUser
    });
});


router.get('/list/:id', async (req, res, next) => {
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

    const tradesPublic = await knex('collector')
        .select('trades_public')
        .where('trades_public', 'true')
        .where('collector_id', id );

    // user's has collectibles if has_quantity is greater than 0
    const collectionsHas = await knex('collection')
        .select(['collectible.attributes', 'collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collectible.attributes', 'collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collectible.attributes', 'collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .andWhere('collection.willing_to_trade_quantity', '>', 0);

    const userWants = await knex('collection')
        .select(['collectible_id'])
        .where('collector_id', '=', id)
        .andWhere('wants_quantity', '>', 0)

    const userWantsCollectibleIds = []
    userWants.forEach((row) => userWantsCollectibleIds.push(row.collectible_id))

    var showHas = null;
    var showWants = null;
    var showTrade = null;

    var showHasPublic = null;
    var showWantsPublic = null;
    var showTradesPublic = null;

    var isLoggedInUser = null;


    if (hasPublic.length > 0) {
        showHasPublic = 1;
    }


    if (wantsPublic.length > 0) {
        showWantsPublic = 1;
    }


    if (tradesPublic.length > 0) {
        showTradesPublic = 1;
    }   

    if (collectionsHas.length > 0) {
        showHas = 1;
    }


    if (collectionsWants.length > 0) {
        showWants = 1;
    }

    if (collectionsWillingToTrade.length > 0) {
        showTrade = 1;
    }

    if (id == req.signedCookies.user_id) {
        isLoggedInUser = 1;
    }

    res.render('collectorpagelist', { 
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
        showTradesPublic,
        isLoggedInUser
    });
});


router.get('/trade/:id', ensureLoggedIn, async (req, res, next) => {
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
    
    // get wants of other user that matches current user trades
    const currentUserToOtherUser = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id','=', currentUserId)
        .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)
 
    // get trades of other user that matches current user wants            
    const otherUserToCurrentUser = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id','=', otherUserId)
        .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
        .andWhere('willing_to_trade_quantity', '>', 0)

    var currentUserMatchesExist = null;
    var otherUserMatchesExist = null;

    if (currentUserToOtherUser.length > 0) {
        currentUserMatchesExist = 1;
    }
    
    if (otherUserToCurrentUser.length > 0) {
        otherUserMatchesExist = 1;
    }

    // only show other user's wants if other user set their wants to public
    const otherUserWantPreference = await knex('collector')
        .select('wants_public')
        .where('collector_id', '=', otherUserId)
        .andWhere('wants_public', '=', 'true')

    var wantsPublic = null;

    if (otherUserWantPreference.length > 0) {
        wantsPublic = 1;
    }

    // only show other user's trades if other user set their trades to public
    const otherUserTradePreference = await knex('collector')
        .select('trades_public')
        .where('collector_id', '=', otherUserId)
        .andWhere('trades_public', '=', 'true')

    var tradesPublic = null;

    if (otherUserTradePreference.length > 0) {
        tradesPublic = 1;
    }

    res.render('trade', {
        title: `Collector\'s Trading Platform | Trade Matches with ${otherUser.username}`,
        currentUser,
        otherUser,
        currentUserCollectibles: currentUserToOtherUser,
        otherUserCollectibles: otherUserToCurrentUser,
        currentUserMatchesExist,
        otherUserMatchesExist,
        wantsPublic,
        tradesPublic
    });
});

router.get('/trade/images/:id', ensureLoggedIn, async (req, res, next) => {
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

        // get wants of other user that matches current user trades
        const currentUserToOtherUser = await knex('collection')
            .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
            .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
            .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
            .where('collector_id','=', currentUserId)
            .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
            .andWhere('willing_to_trade_quantity', '>', 0)
 
        // get trades of other user that matches current user wants    
        const otherUserToCurrentUser = await knex('collection')
            .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
            .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
            .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
            .where('collector_id','=', otherUserId)
            .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
            .andWhere('willing_to_trade_quantity', '>', 0)
    
            
        var currentUserMatchesExist = null;
        var otherUserMatchesExist = null;

        if (currentUserToOtherUser.length > 0) {
            currentUserMatchesExist = 1;
        }
        
        if (otherUserToCurrentUser.length > 0) {
            otherUserMatchesExist = 1;
        }

        // only show other user's wants if other user set their wants to public
        const otherUserWantPreference = await knex('collector')
            .select('wants_public')
            .where('collector_id', '=', otherUserId)
            .andWhere('wants_public', '=', 'true')

        var wantsPublic = null;

        if (otherUserWantPreference.length > 0) {
            wantsPublic = 1;
        }

        // only show other user's trades if other user set their trades to public
        const otherUserTradePreference = await knex('collector')
            .select('trades_public')
            .where('collector_id', '=', otherUserId)
            .andWhere('trades_public', '=', 'true')

        var tradesPublic = null;

        if (otherUserTradePreference.length > 0) {
            tradesPublic = 1;
        }

        res.render('tradeimages', {
            title: `Collector\'s Trading Platform | Trade Matches with ${otherUser.username}`,
            currentUser,
            otherUser,
            currentUserCollectibles: currentUserToOtherUser,
            otherUserCollectibles: otherUserToCurrentUser,
            currentUserMatchesExist,
            otherUserMatchesExist,
            wantsPublic,
            tradesPublic
        });
    });



module.exports = router;