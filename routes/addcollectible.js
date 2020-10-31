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
                    res.redirect(`/add-collectible/image/${collectibleID}`);
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


// display the image of a collectible_id
// with help from https://www.youtube.com/watch?v=SAUvlkTDMM4
router.get('/image/:id', async (req, res, next) => { 
    const id = req.params.id;
    const collectible = await knex('collectible').where({collectible_id: id}).first();
    if (collectible) {
        
  
        const contentType = await FileType.fromBuffer(collectible.image); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
        res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
        res.end(collectible.image);

    } else {
        res.end('No Img with that Id!');
    }
});

module.exports = router;