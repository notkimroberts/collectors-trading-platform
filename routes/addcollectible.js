const Collectible = require('../models/Collectible.js');
const FileType = require('file-type');
const express = require('express');
const knex = require('../connection')
const router = express.Router();


// check if valid collectible name
function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}


router.get('/', (req, res, next) => {
    res.render('addCollectible');
});


router.post('/', async (req, res, next) => {
    // if input is valid
    if(validCollectible(req.body)) {

        // Check if existing collectible name
        if (await Collectible.getByName(req.body.name)) {
            res.render('addCollectible', { 
                    message: 'That collectible name already exists in the database. unique names only',
                    messageClass: 'alert-danger'
                }
            )
            return
        }

        // Check if user selected picture
        if (!req.files) {
            res.render('addCollectible', { 
                    message: 'Please choose a jpeg image to upload',
                    messageClass: 'alert-danger'
                }
            )
            return
        }

        
        Collectible
            .getByName(req.body.name)
            .then(async (collectible) => {
                // if the name of the collectible is not in database
                if (!collectible) {



                    // store the name and data from the file
                    const {name, data} = req.files.pic;

                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        image: data,
                        image_url: "http://placeimg.com/640/480", // hard coded as it can't be null
                        total_quantity: req.body.total_quantity,
                        };

                    // create the new collectible entry
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/image/${collectibleID}`);
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