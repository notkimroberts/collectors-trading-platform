const express = require('express');
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');
const Collector_ratings = require('../models/collector_ratings')
const { ensureLoggedIn } = require('../auth/middleware')


// page for logged in user to select rating for another user
router.get('/rating/:id', async (req, res, next) => {
    const { id } = req.params;
    const fromUser = req.signedCookies.user_id;

    var isLoggedInUser = null;

    if (id == req.signedCookies.user_id) {
        isLoggedInUser = 1;
    }

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', id );

    // if no such collector, redirect to hompage
    if (collectorData.length == 0) {
        res.redirect('/');
        return;
    }

    const collectorsRatings = await knex('collector_ratings')
        .select('collector_ratings.rating', 'collector_ratings.comment', 'collector_ratings.from_user_id', 'collector.collector_id', 'collector.username')
        .select(knex.raw("to_char(collector_ratings.updated_at, 'YYYY-MM-DD') as updated_at"))       
        .join('collector', 'collector.collector_id', 'collector_ratings.from_user_id')
        .where('to_user_id', '=', id)

    if (collectorsRatings.length == 0) {
        var noRatingsToList = 1;
    }

    res.render('rating', { 
        title: `Collector\'s Trading Platform | Rating`,
        collector: collectorData,
        id,
        fromUser,
        ratings: collectorsRatings,
        isLoggedInUser,
        noRatingsToList
    });
});

// post request to give user a rating
router.post('/rating/:id', async (req, res, next) => { 
    const { id } = req.params;
    const toUser = id;
    const fromUser = req.signedCookies.user_id;
    const stars = req.body.stars;
    const userComment = req.body.comment;

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', id );

    // if no such collector, redirect to hompage
    if (collectorData.length == 0) {
        res.redirect('/');
        return;
    }
    const getRatingFromLoggedInUser = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('from_user_id', '=', fromUser);


    // ensure to user and from user are not the same, otherwise render error
    if (toUser == fromUser) {
        var isLoggedInUser = 1;

        const collectorsRatings = await knex('collector_ratings')
        .select('collector_ratings.rating', 'collector_ratings.comment', 'collector_ratings.from_user_id', 'collector.collector_id', 'collector.username')
        .select(knex.raw("to_char(collector_ratings.updated_at, 'YYYY-MM-DD') as updated_at"))         
        .join('collector', 'collector.collector_id', 'collector_ratings.from_user_id')
        .where('to_user_id', '=', id)


        res.render('rating', { 
            title: `Collector\'s Trading Platform | Rating`,
            message: 'Error: You cannot give yourself a rating',
            messageClass: 'alert-danger',
            collector: collectorData,
            id,
            fromUser,
            ratings: collectorsRatings,
            isLoggedInUser
        });
        return;
    }



    // update rating if logged in user already gave a rating
    if (getRatingFromLoggedInUser.length > 0) {
        await knex('collector_ratings')
            .update({rating: stars})
            .update({comment: userComment})
            .update({updated_at: knex.fn.now()})
            .where('to_user_id', '=', id)
            .andWhere('from_user_id', '=', fromUser);
    }
    // else insert rating
    else {    
        await Collector_ratings.create(fromUser, toUser, stars, userComment);
    }

    const collectorsRatings = await knex('collector_ratings')
        .select('collector_ratings.rating', 'collector_ratings.comment', 'collector_ratings.from_user_id', 'collector.collector_id', 'collector.username')
        .select(knex.raw("to_char(collector_ratings.updated_at, 'YYYY-MM-DD') as updated_at"))         
        .join('collector', 'collector.collector_id', 'collector_ratings.from_user_id')
        .where('to_user_id', '=', id)

    var ratingGiven = 1;

    res.render('rating', { 
        title: `Collector\'s Trading Platform | Rating`,
        message: 'Thank you for rating this collector',
        messageClass: 'alert-success',
        collector: collectorData,
        id,
        fromUser,
        ratingGiven,
        ratings: collectorsRatings
    }
)  
return;
});

router.get('/', async (req, res, next) => {
    const collectors = await knex('collector')
      .select('collector.collector_id', 'collector.username', 'collector.email', 'collector.phone_number', 'collector.is_admin')
      .orderBy('collector.username');
  
      // if results, render collectibles
      if (collectors.length > 0) {
          res.render('collector', {
          title: `Collector\'s Trading Platform | Collectors`,
          collector: collectors,
      });
          return;
      }
  
      // if no results, inform user
      else {
          res.render('collector', { 
                  title: `Collector\'s Trading Platform | Collectors`,
                  message: `No results`,
                  messageClass: 'alert-info',
              }
          )
          return;
      }
});

router.get('/search', async (req, res, next) => {
  const { username } = req.query;
  var search = 1;
  const collectors = await knex('collector')
    .select('collector.collector_id', 'collector.username', 'collector.email', 'collector.phone_number', 'collector.is_admin')
    .where('collector.username', 'ilike', `%${username}%`);

    // if results, render collectibles
    if (collectors.length > 0) {
        res.render('collector', {
        title: `Collector\'s Trading Platform | Search Results`,
        collector: collectors,
        search,
        username
    });
        return;
    }

    // if no results, inform user
    else {
        res.render('collector', { 
                title: `Collector\'s Trading Platform | Search Results`,
                message: `No results matching your search term "${username}"`,
                messageClass: 'alert-info',
                search,
                username
            }
        )
        return;
    }
  });

router.get(['/:id', '/:id?:filter'], async (req, res, next) => {
    const { id } = req.params;
    let filterTypes = req.query.filter
    if (typeof filterTypes === 'string' || filterTypes instanceof String) {
        filterTypes = [filterTypes]
    }

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', id );

    // if no such collector, redirect to hompage
    if (collectorData.length == 0) {
        res.redirect('/');
        return;
    }

    // get user's ratings by star count
    const rating1 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '1');
    const rating2 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '2');
    const rating3 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '3');
    const rating4 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '4');
    const rating5 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '5');

    var starCount = 0;
    var totalRatings = 0;
    var averageStars = 0;

    //formula for calculating stars
    starCount = (1*rating1.length) + (2*rating2.length) + (3*rating3.length) + (4*rating4.length) + (5*rating5.length);
    totalRatings = rating1.length + rating2.length + rating3.length + rating4.length + rating5.length;
    averageStars = starCount/totalRatings;

    //showing the number of stars on profile page
    if (averageStars >= '0' && averageStars < '0.25') {
        var zeroStar = 1;
    }
    else if (averageStars >= '0.25' && averageStars < '0.75') {
        var halfStar = 1;
    }
    else if (averageStars >= '0.75' && averageStars < '1.25') {
        var oneStar = 1;
    }
    else if (averageStars >= '1.25' && averageStars < '1.75') {
        var oneHalfStar = 1;
    }
    else if (averageStars >= '1.75' && averageStars < '2.25') {
        var twoStar = 1;
    }
    else if (averageStars >= '2.25' && averageStars < '2.75') {
        var twoHalfStar = 1;
    }
    else if (averageStars >= '2.75' && averageStars < '3.25') {
        var threeStar = 1;
    }
    else if (averageStars >= '3.25' && averageStars < '3.75') {
        var threeHalfStar = 1;
    }
    else if (averageStars >= '3.75' && averageStars < '4.25') {
        var fourStar = 1;
    }
    else if (averageStars >= '4.25' && averageStars < '4.75') {
        var fourhalfStar = 1;
    }
    else if (averageStars >= '4.75' && averageStars <= '5') {
        var fiveStar = 1;
    }
    else {
        var noRating = 1;
    }

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
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
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
        isLoggedInUser,
        zeroStar,
        halfStar,
        oneStar,
        oneHalfStar,
        twoStar,
        twoHalfStar,
        threeStar,
        threeHalfStar,
        fourStar,
        fourhalfStar,
        fiveStar,
        noRating
    });
});

router.get(['/list/:id', '/list/:id/:filter'], async (req, res, next) => {
    const { id } = req.params;
    let filterTypes = req.query.filter
    if (typeof filterTypes === 'string' || filterTypes instanceof String) {
        filterTypes = [filterTypes]
    }

    // get user's ratings by star count
    const rating1 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '1');
    const rating2 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '2');
    const rating3 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '3');
    const rating4 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '4');
    const rating5 = await knex('collector_ratings')
        .select('rating')
        .where('to_user_id', '=', id)
        .andWhere('rating', '=', '5');

    var starCount = 0;
    var totalRatings = 0;
    var averageStars = 0;

    //formula for stars
    starCount = (1*rating1.length) + (2*rating2.length) + (3*rating3.length) + (4*rating4.length) + (5*rating5.length);
    totalRatings = rating1.length + rating2.length + rating3.length + rating4.length + rating5.length;
    averageStars = starCount/totalRatings;

    //showing star rating on profile page
    if (averageStars >= '0' && averageStars < '0.25') {
        var zeroStar = 1;
    }
    else if (averageStars >= '0.25' && averageStars < '0.75') {
        var halfStar = 1;
    }
    else if (averageStars >= '0.75' && averageStars < '1.25') {
        var oneStar = 1;
    }
    else if (averageStars >= '1.25' && averageStars < '1.75') {
        var oneHalfStar = 1;
    }
    else if (averageStars >= '1.75' && averageStars < '2.25') {
        var twoStar = 1;
    }
    else if (averageStars >= '2.25' && averageStars < '2.75') {
        var twoHalfStar = 1;
    }
    else if (averageStars >= '2.75' && averageStars < '3.25') {
        var threeStar = 1;
    }
    else if (averageStars >= '3.25' && averageStars < '3.75') {
        var threeHalfStar = 1;
    }
    else if (averageStars >= '3.75' && averageStars < '4.25') {
        var fourStar = 1;
    }
    else if (averageStars >= '4.25' && averageStars < '4.75') {
        var fourhalfStar = 1;
    }
    else if (averageStars >= '4.75' && averageStars <= '5') {
        var fiveStar = 1;
    }
    else {
        var noRating = 1;
    }

    const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', id );

    // if no such collector, redirect to hompage
    if (collectorData.length == 0) {
        res.redirect('/');
        return;
    }
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
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
        .andWhere('collection.has_quantity', '>', 0);

    // user's wants collectibles if has_quantity is greater than 0
    const collectionsWants = await knex('collection')
        .select(['collectible.attributes', 'collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
        .andWhere('collection.wants_quantity', '>', 0);

    // user's willing to trade collectibles if willing_to_trade_quantity is greater than 0
    const collectionsWillingToTrade = await knex('collection')
        .select(['collectible.attributes', 'collectible_type.name as typeName', 'collection.collectible_id', 'collection.has_quantity', 'collection.wants_quantity', 'collection.willing_to_trade_quantity', 'collectible.name'])
        .join('collectible', 'collectible.collectible_id', 'collection.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id', id )
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
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
        isLoggedInUser,
        zeroStar,
        halfStar,
        oneStar,
        oneHalfStar,
        twoStar,
        twoHalfStar,
        threeStar,
        threeHalfStar,
        fourStar,
        fourhalfStar,
        fiveStar,
        noRating
    });
});

router.get(['/trade/:id', '/trade/:id?:filter'], ensureLoggedIn, async (req, res, next) => {
    const currentUserId = req.signedCookies.user_id
    const otherUserId = req.params.id

    const collectorData = await knex('collector')
    .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
    .where('collector_id', otherUserId );

    // if no such collector, redirect to hompage
    if (collectorData.length == 0) {
        res.redirect('/');
        return;
    }

    if (otherUserId === currentUserId) {
        res.redirect('/profile')
        return;
    }


    let filterTypes = req.query.filter
    if (typeof filterTypes === 'string' || filterTypes instanceof String) {
        filterTypes = [filterTypes]
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
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
        .andWhere('willing_to_trade_quantity', '>', 0)
 
    // get trades of other user that matches current user wants            
    const otherUserToCurrentUser = await knex('collection')
        .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
        .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
        .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
        .where('collector_id','=', otherUserId)
        .whereIn('collection.collectible_id', currentUserWantsCollectibleIds)
        .modify((builder) => {
            if (filterTypes && filterTypes.length) {
                builder.whereIn('collectible_type.name', filterTypes)
            }
        })
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

router.get(['/trade/images/:id', '/trade/images/:id?:filter'], ensureLoggedIn, async (req, res, next) => {
        const currentUserId = req.signedCookies.user_id
        const otherUserId = req.params.id
        console.log(otherUserId);
        
        const collectorData = await knex('collector')
        .select('username', 'email', 'phone_number', 'collector_id', 'is_admin')
        .where('collector_id', otherUserId );
    
        // if no such collector, redirect to hompage
        if (collectorData.length == 0) {
            res.redirect('/');
            return;
        }
        if (otherUserId === currentUserId) {
            res.redirect('/profile')
            return;
        }

        let filterTypes = req.query.filter
        if (typeof filterTypes === 'string' || filterTypes instanceof String) {
            filterTypes = [filterTypes]
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
            .modify((builder) => {
                if (filterTypes && filterTypes.length) {
                    builder.whereIn('collectible_type.name', filterTypes)
                }
            })
            .whereIn('collection.collectible_id', otherUserWantsCollectibleIds)
            .andWhere('willing_to_trade_quantity', '>', 0)
 
        // get trades of other user that matches current user wants    
        const otherUserToCurrentUser = await knex('collection')
            .select(['collectible_type.name as typeName', 'collection.collector_id', 'collection.collectible_id', 'collectible.name', 'collection.willing_to_trade_quantity'])
            .join('collectible', 'collection.collectible_id', 'collectible.collectible_id')
            .join('collectible_type', 'collectible_type.collectible_type_id', 'collectible.collectible_type_id')
            .where('collector_id','=', otherUserId)
            .modify((builder) => {
                if (filterTypes && filterTypes.length) {
                    builder.whereIn('collectible_type.name', filterTypes)
                }
            })
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