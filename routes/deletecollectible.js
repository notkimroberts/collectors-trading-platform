const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');
const { ensureLoggedIn } = require('../auth/middleware')


router.get('/', ensureLoggedIn, (req, res, next) => {
    res.render('deletecollectible', { title: "delete collectible" });
});

router.post('/', async (req, res, next) => {
    const { collectible_id } = req.body;
    const userId = req.signedCookies.user_id;

    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        res.render('deletecollectible', { 
                message: 'That collectible id does not exist',
                messageClass: 'alert-danger'
            }
        )
        return
    }

    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: collectible_id }).first();
    
    const collectorData = await knex('collector')
    .select('is_admin')
    .where('collector_id', userId ).first();

    const collectibleType = collectibleData.collectible_type_id;
    const adminType = collectorData.is_admin;

    // if the admin type does not match the collectible type and the admin type is not an all admin, render error
    if (collectibleType != adminType && adminType != 6) { 
        res.render('deletecollectible', { 
        message: 'You do not have the admin privilege to delete this collectible',
        messageClass: 'alert-danger'
        }   
        )
        return
    }

    // delete collectible
    await knex('collectible')
    .where({collectible_id: collectible_id})
    .delete();

        res.render('deletecollectible', { 
            message: 'Collectible has been deleted',
            messageClass: 'alert-success'
        }
    )  
    return
});


module.exports = router;