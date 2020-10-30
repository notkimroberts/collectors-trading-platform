const express = require('express');
const router = express.Router();
const Collectible = require('../models/collectible.js');
const Collectible_type = require('../models/collectibletype.js');
const knexfile = require('../sql/knexfile.js');
const FileType = require('file-type');
const fileUpload = require('express-fileupload');
const { type_name } = require('../templates/lego.js');
const knex = require('../connection')





router.get('/', (req, res, next) => {
    res.render('addcollectible', { title: "Add Collectible" });
});

/*
// get collectible types
function getCollectibleType(res, postgresql, context, complete){
    postgresql.knex.from('collectible_type').select('collectible_type_id', 'name',
    // mysql.pool.query("SELECT collectible_type_id, name FROM collectible_type", 
    function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.collectible_type = results;
        complete();
    });
}

*/

// check if valid collectible name
function validCollectible(collectible) {
    
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
    
}


/*
router.post('/', async (req, res, next) => {
    // if input is valid
    if(validCollectible(req.body)) {
        Collectible    
            .getOneByName(req.body.name)
            .then(collectible => {
                console.log('collectible', collectible);
                // if the name of the collectible is not in database
               // if (collectible) {
                if (req.body.type_name == "lego") {
                    collectible = {
                        name: req.body.name,
                        //attributes: req.body.collectible_type_id,
                        image_url: req.body.image_url,
                        // image_url: req.files.image_url,
                        total_quantity: req.body.total_quantity,
                        attributes: 
                            {type_name: req.body.type_name, 
                            name: req.body.name2, 
                            theme: req.body.theme,
                            set_number: req.body.set_number,
                            designed_by: req.body.designed_by,
                            piece_count: req.body.piece_count}


                        };
                    }

                    else {
                        res.json({
                                    message: 'not lego'
                        });
                    }
                    //const collectible = {
*/
/*                      
                      collectible = {
                        name: req.body.name,
                        //attributes: req.body.collectible_type_id,
                        image_url: req.body.image_url,
                        // image_url: req.files.image_url,
                        total_quantity: req.body.total_quantity,
                        attributes: {type_name: req.body.type_name, name: req.body.name2, theme: req.body.theme}


                        };
*/

/*
                    Collectible
                    .create(collectible)
                    .then(collectible_id => {
                        res.json({
                            collectible_id,
                            message: 'unique collectible'
                        });
                    });    
*/
             //   }
/*
                // Collectible with that name already exists
                else {
                    next(Error("Collectible with that name is already in database"));
                }
*/

/*
    });
}
    // else fields were not valid
    else {
        next(new Error('Invalid name'));
    }
});

*/


router.post('/', async (req, res, next) => {
    // if input is valid
    if(validCollectible(req.body)) {
        Collectible    
            .getOneByName(req.body.name)
            .then(collectible => {
                console.log('collectible', collectible);
                // if the name of the collectible is not in database
                if (!collectible) {


                    // store the name and data from the file
                    const {name, data} = req.files.pic;
/*
                    if (name && data) {
                        knex('collectible').where({collectible_id: collectible_id}).update({ imagebytea: data});
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(400);
                    }
  */                
                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        imagebytea: data,
                        image_url: "http://placeimg.com/640/480", // hard coded as it can't be null
                        total_quantity: req.body.total_quantity,
                        };

                    
                    // create the new collectible entry
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


// display the image of a collectible_id
// with help from https://www.youtube.com/watch?v=SAUvlkTDMM4
router.get('/imagebytea/:id', async (req, res, next) => { 
    const id = req.params.id;
    const collectible = await knex('collectible').where({collectible_id: id}).first();
    if (collectible) {
        
  
        const contentType = await FileType.fromBuffer(collectible.imagebytea); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
        res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
        res.end(collectible.imagebytea);

    } else {
        res.end('No Img with that Id!');
    }
    
/*
    res.json({
        message: '👨‍'
    });
    */
/*
    const collectible = Collectible.getOneByImage(88);
    if (collectible) {
        const contentType = await FileType.fromBuffer(collectible.imagbytea); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
        res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
        //res.end(image_url.image_url)

    }
    else {
        res.end('no image with that id')
    }

    */

});





module.exports = router;