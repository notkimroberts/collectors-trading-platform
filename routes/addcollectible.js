const express = require('express');
const router = express.Router();
const Collectible = require('../models/collectible.js');
const knexfile = require('../sql/knexfile.js');
const FileType = require('file-type');
const fileUpload = require('express-fileupload');

router.get('/', (req, res, next) => {
    res.render('addcollectible', { title: "Add Collectible" });
});


// checks to see if email field has something in it and that password is atleast 6 characters
function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}



router.post('/', async (req, res, next) => {
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
                        image_url: req.files.image_url,
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


router.get('/image_url/', async (req, res, next) => { 
/*
    res.json({
        message: '👨‍'
    });
    */

    const collectible = Collectible.getOneByImage(8);
    if (collectible) {
        const contentType = await FileType.fromBuffer(collectible.image_url); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
        res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
        //res.end(image_url.image_url)

    }
    else {
        res.end('no image with that id')
    }

});

module.exports = router;