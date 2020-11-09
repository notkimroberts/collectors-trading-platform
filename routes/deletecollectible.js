const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');


router.get('/', (req, res, next) => {
    res.render('deletecollectible', { title: "delete collectible" });
});

router.post('/', async (req, res, next) => {
    const { collectible_id } = req.body;

    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        res.render('deletecollectible', { 
                message: 'That collectible id does not exist',
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