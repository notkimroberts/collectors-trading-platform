/*
const express = require('express');
const router = express.Router();
const Collectible = require('../../models/collectible.js');


// checks to see if email field has something in it and that password is atleast 6 characters
function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}



router.post('/addcollectible', (req, res, next) => {
    // if input is valid
    if(validCollectible(req.body)) {
        Collectible    
            .getOneByName(req.body.name)
            .then(collectible => {
                console.log('collectible', collectible);
                // if the name of the collectible is not in database
                if (!collectible) {
                    const collectible = {
                        name: req.body.name,
                       // image_url: req.body.image_url,
                        total_quantity: req.body.total_quantity,
                        };

                    Collectible
                    .create(collectible)
                    .then(collectible_id => {
                        res.json({
                            collectible_id,
                            message: 'unique collectible'
                        });
                    });    

                }
                // Collectible with that name already exists
                else {
                    next(Error("Collectible with that name is already in database"));
                }
    });
}
    // else fields were not valid
    else {
        next(new Error('Invalid name'));
    }
});

module.exports = router;

*/