const Collectible = require('../models/Collectible.js');
const Collector = require('../models/Collector.js');
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
        
        const { name, collectible_id } = req.body;

        // Check if existing collectible name
        if (await Collectible.getByName(name)) {
            res.render('editcollectiblename', { 
                    message: 'That collectible name already exists in the database. unique names only',
                    messageClass: 'alert-danger'
                }
            )
            return
        }



        // Check if existing collector_id
        if (!(await Collectible.getById(collectible_id))) {
            res.render('editcollectiblename', { 
                    message: 'That collectible_id does not exist',
                    messageClass: 'alert-danger'
                }
            )
            return
        }







        await knex('collectible').where({collectible_id: collectible_id}).update({ name: name});
        
                
        res.redirect('/');
                    
    }   


    // else fields were not valid
    else {
        next(new Error('Invalid name'));
    }
});



module.exports = router;