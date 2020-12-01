const Collectible = require('../models/collectible');
const FileType = require('file-type');
const express = require('express');
const router = express.Router();
const knex = require('../connection')
const { ensureLoggedIn } = require('../auth/middleware')


function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const userId = req.signedCookies.user_id;
    const collectorData = await knex('collector')    
    .select('is_admin')
    .where({ collector_id: userId }).first();

    if (collectorData.is_admin == 1) {
        var selectLego = 1;
    }

    if (collectorData.is_admin == 2) {
        var selectFunko = 1;
    }
    if (collectorData.is_admin == 3) {
        var selectPusheen = 1;
    }

    if (collectorData.is_admin == 4) {
        var selectPokemon = 1;
    }
    else if  (collectorData.is_admin == 5) {
        var selectHotWheels = 1;
    }

    res.render('addcollectible', {
        title: "add collectible", 
        selectLego,
        selectFunko,
        selectPusheen,
        selectPokemon,
        selectHotWheels,
    });
});

router.post('/', async (req, res, next) => {
    const { data } = req.files.pic;
    const typeSelected = req.body.collectible_type;
    const userId = req.signedCookies.user_id;
    const collectorData = await knex('collector')    
    .select('is_admin')
    .where({ collector_id: userId }).first();
    
    const userAdminType = collectorData.is_admin;

    if(validCollectible(req.body)) {
        if(userAdminType !=typeSelected && userAdminType != "6") {
            res.render('addcollectible', { 
                message: 'You do not have the admin privilege to edit this collectible',
                messageClass: 'alert-danger'
                }   
            )
            return
        }
        if (await Collectible.getByName(req.body.name)) {
            res.render('addcollectible', { 
                    message: 'That collectible name already exists in the database. Unique names only.',
                    messageClass: 'alert-danger'
                }
            )
            return
        }
        if (!req.files) {
            res.render('addcollectible', { 
                    message: 'Please choose a jpeg image to upload',
                    messageClass: 'alert-danger'
                }
            )
            return
        }
        Collectible
        .getByName(req.body.name)
        .then(async (collectible) => {
            if (!collectible) {
                if (typeSelected == "1") {
                    if (!req.body.piece_count) {
                        res.render('addcollectible', { 
                                message: 'Please add piece count',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.set_number) {
                        res.render('addcollectible', { 
                                message: 'Please add set_number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.theme) {
                        res.render('addcollectible', { 
                                message: 'Please add theme',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.designed_by) {
                        res.render('addcollectible', { 
                                message: 'Please add designer',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    const collectible = {
                        name: req.body.name,
                        collectible_type_id: typeSelected,
                        image: data,
                        attributes: 
                        {
                            piece_count: req.body.piece_count, 
                            set_number: req.body.set_number, 
                            theme:  req.body.theme, 
                            designed_by: req.body.designed_by
                        }
                    };
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }
                else if (typeSelected == "2") {
                    if (!req.body.number) {
                        res.render('addcollectible', { 
                                message: 'Please add number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.line) {
                        res.render('addcollectible', { 
                                message: 'Please add line',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        collectible_type_id: typeSelected,
                        image: data,
                        attributes: 
                        {
                            number: req.body.number, 
                            line: req.body.line
                        }
                    };
                    // create the new collectible entry
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }      
                else if (typeSelected == "3") {
                    if (!req.body.product_type1) {
                        res.render('addcollectible', { 
                                message: 'Please add product type',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.season) {
                        res.render('addcollectible', { 
                                message: 'Please add season/holiday',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        collectible_type_id: typeSelected,
                        image: data,
                        attributes: 
                        {
                            product_type: req.body.product_type1,
                            season: req.body.season 
                        }
                    };
                    // create the new collectible entry
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }
                else if (typeSelected == "4") {
                    if (!req.body.product_type) {
                        res.render('addcollectible', { 
                                message: 'Please add product type',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }

                    if (!req.body.generation) {
                        res.render('addcollectible', { 
                                message: 'Please add generation',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        collectible_type_id: typeSelected,
                        image: data,
                        attributes: 
                                    {
                                        product_type: req.body.product_type,
                                        generation: req.body.generation 
                                    }
                        };
                    // create the new collectible entry
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }
                else if (typeSelected == "5") {
                    if (!req.body.number1) {
                        res.render('addcollectible', { 
                                message: 'Please add number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.series) {
                        res.render('addcollectible', { 
                                message: 'Please add series',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.year_released1) {
                        res.render('addcollectible', { 
                                message: 'Please add year released',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    // obtain fields from form and store
                    const collectible = {
                        name: req.body.name,
                        collectible_type_id: typeSelected,
                        image: data,
                        attributes: 
                        {
                        number: req.body.number1, 
                        series: req.body.series,
                        year_released: req.body.year_released1
                        }
                    };
                    // create the new collectible entry
                    const collectibleID = await Collectible.create(collectible);
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }
                else {
                    res.render('addcollectible', { 
                        message: 'No collectible with that type',
                        messageClass: 'alert-danger'
                        }   
                    )
                    return
                }
            }
            // Collectible with that name already exists
            else {
                next(Error("Collectible with that name is already in the database"));
            }
        });
    }
    // else name is not valid
    else {
        res.render('addcollectible', { 
            message: 'Invalid name',
            messageClass: 'alert-danger'
            }   
        )
        return
    }
});


module.exports = router;