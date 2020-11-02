const Collectible = require('../models/Collectible.js');
const express = require('express');
const router = express.Router();


function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}


router.get('/', (req, res, next) => {
    res.render('addCollectible');
});


router.post('/', async (req, res, next) => {
    if(validCollectible(req.body)) {
        if (await Collectible.getByName(req.body.name)) {
            res.render('addCollectible', { 
                    message: 'That collectible name already exists in the database. unique names only',
                    messageClass: 'alert-danger'
                }
            )
            return
        }

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
                if (!collectible) {
                    const { data } = req.files.pic;
                    const typeSelected = req.body.collectible_type;

                    if (typeSelected == "lego") {
                        const collectibleType = 1;
                        if (!req.body.piece_count) {
                            res.render('addCollectible', { 
                                    message: 'Please add piece count',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }

                        if (!req.body.set_number) {
                            res.render('addCollectible', { 
                                    message: 'Please add set_number',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }

                        if (!req.body.theme) {
                            res.render('addCollectible', { 
                                    message: 'Please add theme',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }

                        if (!req.body.designed_by) {
                            res.render('addCollectible', { 
                                    message: 'Please add designed by',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }

                        const collectible = {
                            name: req.body.name,
                            collectible_type_id: collectibleType,
                            image: data,
                            image_url: "http://placeimg.com/640/480", // hard coded as it can't be null
                            attributes: 
                                    {
                                        piece_count: req.body.piece_count, 
                                        set_number: req.body.set_number, 
                                        theme:  req.body.theme, 
                                        designed_by: req.body.designed_by
                                    }
                            };

                        const collectibleID = await Collectible.create(collectible);
                        res.redirect(`/collectible/image/${collectibleID}`);
                    }

                    else if (typeSelected == "funko") {
                        const collectibleType = 2;
                        if (!req.body.number) {
                            res.render('addCollectible', { 
                                    message: 'Please add number',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }
                
                        if (!req.body.line) {
                            res.render('addCollectible', { 
                                    message: 'Please add line',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }

                        // obtain fields from form and store
                        const collectible = {
                            name: req.body.name,
                            collectible_type_id: collectibleType,
                            image: data,
                            image_url: "http://placeimg.com/640/480", // hard coded as it can't be null
                            attributes: 
                                        {
                                            number: req.body.number, 
                                            line: req.body.line
                                        }
                            };
                        // create the new collectible entry
                        const collectibleID = await Collectible.create(collectible);
                        res.redirect(`/collectible/image/${collectibleID}`);
                    }

                    else if (typeSelected == "hot_wheel") { 
                        const collectibleType = 5;

                        if (!req.body.number1) {
                            res.render('addCollectible', { 
                                    message: 'Please add number1',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }
                
                        if (!req.body.series) {
                            res.render('addCollectible', { 
                                    message: 'Please add series',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }
                
                        if (!req.body.year_released1) {
                            res.render('addCollectible', { 
                                    message: 'Please add year released',
                                    messageClass: 'alert-danger'
                                }
                            )
                            return
                        }
                        // obtain fields from form and store
                        const collectible = {
                            name: req.body.name,
                            collectible_type_id: collectibleType,
                            image: data,
                            image_url: "http://placeimg.com/640/480", // hard coded as it can't be null
                            attributes: 
                                        {
                                        number: req.body.number1, 
                                        series: req.body.series,
                                        year_released: req.body.year_released1
                                        }
                            };

                        // create the new collectible entry
                        const collectibleID = await Collectible.create(collectible);
                        res.redirect(`/collectible/image/${collectibleID}`);

                    
                    }
                    
                    else {

                        res.render('addCollectible', { 
                            message: 'no collectible with that type',
                            messageClass: 'alert-danger'
                            }   
                        )
                            return

                    }


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