const Collectible = require('../models/Collectible');
const express = require('express');
const knex = require('../connection')
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('editCollectible', { title: "edit collectible" });
});


// check if valid collectible name
function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}


router.post('/', async (req, res, next) => {
    const { collectible_id, name } = req.body;

    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        res.render('editCollectible', { 
                message: 'That collectible_id does not exist',
                messageClass: 'alert-danger'
            }
        )
        return
    }

    // Check if user updated anything, if not, show error
    if (!req.files && !req.body.name) {
        res.render('editCollectible', { 
            message: 'You need to input something to update',
            messageClass: 'alert-danger'
        }
    )

        return
    }

    // Check if existing collectible name
    if (await Collectible.getByName(name)) {
        res.render('editCollectible', { 
                message: 'That collectible name already exists in the database. unique names only',
                messageClass: 'alert-danger'
            }
        )
        return
    }

    if (name) {
        // update name
        await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
    }

    if (req.files) {
        const {data} = req.files.pic;
        if (data) {
        // update image
        await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
        }
    
    }

    // update updated_at time
    await knex('collectible').where({collectible_id: collectible_id}).update({updated_at: knex.fn.now()});

    res.redirect(`/collectible/${collectible_id}`);
});


module.exports = router;