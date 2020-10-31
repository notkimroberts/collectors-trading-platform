const Collectible = require('../models/Collectible.js');
const express = require('express');
const knex = require('../connection')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('editcollectiblename', { title: "edit collectible name" });
});


// check if valid collectible name
function validCollectible(collectible) {
    
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
    
}






router.post('/', async (req, res, next) => {
    // if input is valid
    if(validCollectible(req.body)) {
        


                        await knex('collectible').where({collectible_id: req.body.collectible_id}).update({ name: req.body.name});
                        res.sendStatus(200);                    
                                       
                }


    // else fields were not valid
    else {
        next(new Error('Invalid name'));
    }
});



module.exports = router;