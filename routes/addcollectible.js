const Collectible = require('../models/collectible');
const FileType = require('file-type');
const express = require('express');
const router = express.Router();
const knex = require('../connection')
const { ensureLoggedIn } = require('../auth/middleware')

//determines valid collectible based on name
function validCollectible(collectible) {
    const validName = typeof collectible.name == 'string' && collectible.name.trim() != '';
    return validName;
}

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const userId = req.signedCookies.user_id;
    const collectorData = await knex('collector')    
    .select('is_admin')
    .where({ collector_id: userId }).first();

    //auto populates type selection on add collectible screen
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
        title: "Collector\'s Trading Platform | Add Collectible", 
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

    //auto populates type selection on add collectible screen
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
    
    const userAdminType = collectorData.is_admin;

    theName = req.body.name;
    thePieceCount = req.body.piece_count;
    theSetNumber = req.body.set_number;
    theTheme = req.body.theme;
    theDesigner = req.body.designed_by;
    theNumber = req.body.number;
    theLine = req.body.line;
    theProductType1 = req.body.product_type1;
    theSeason = req.body.season;
    theProductType = req.body.product_type;
    theGeneration = req.body.generation;
    theNumber1 = req.body.number1;
    theSeries = req.body.series;
    theYearReleased1 = req.body.year_released1;

    if(validCollectible(req.body)) {
        if(userAdminType !=typeSelected && userAdminType != "6") { //if user admin is not the collectible type or if not all admin
            res.render('addcollectible', { 
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                theName,
                message: 'You do not have the admin privilege to add this collectible type.',
                messageClass: 'alert-danger'
                }   
            )
            return
        }
        if (await Collectible.getByName(req.body.name)) { //name already exists

            // The admin type is already correct if in this statement. rendering the typeSelected will be correct for every admin type
            if (typeSelected == 1) {
                var selectLego = 1;
            }
        
            if (typeSelected == 2) {
                var selectFunko = 1;
            }
            if (typeSelected == 3) {
                var selectPusheen = 1;
            }
        
            if (typeSelected == 4) {
                var selectPokemon = 1;
            }
            else if  (typeSelected == 5) {
                var selectHotWheels = 1;
            }

            res.render('addcollectible', { 
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    thePieceCount,
                    theSetNumber,
                    theTheme,
                    theDesigner,
                    theNumber,
                    theLine,
                    theProductType1,
                    theSeason,
                    theProductType,
                    theGeneration,
                    theNumber1,
                    theSeries,
                    theYearReleased1,
                    message: 'That collectible name already exists in the database. Unique names only.',
                    messageClass: 'alert-danger'
                }
            )
            return
        }
        if (!req.files) {
            res.render('addcollectible', {  //need to upload image
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    theName,
                    thePieceCount,
                    theSetNumber,
                    theTheme,
                    theDesigner,
                    theNumber,
                    theLine,
                    theProductType1,
                    theSeason,
                    theProductType,
                    theGeneration,
                    theNumber1,
                    theSeries,
                    theYearReleased1,
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
                if (typeSelected == "1") { //if lego input below lego attributes
                    var selectLego = 1;
                    if (!req.body.piece_count) {
                        res.render('addcollectible', { 
                                selectLego,
                                theName,
                                thePieceCount,
                                theSetNumber,
                                theTheme,
                                theDesigner,
                                message: 'Please add piece count',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.set_number) {
                        res.render('addcollectible', { 
                                selectLego,
                                theName,
                                thePieceCount,
                                theSetNumber,
                                theTheme,
                                theDesigner,
                                message: 'Please add set number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.theme) {
                        res.render('addcollectible', { 
                                selectLego,
                                theName,
                                thePieceCount,
                                theSetNumber,
                                theTheme,
                                theDesigner,
                                message: 'Please add theme',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.designed_by) {
                        res.render('addcollectible', { 
                                selectLego,
                                theName,
                                thePieceCount,
                                theSetNumber,
                                theTheme,
                                theDesigner,
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
                    const collectibleID = await Collectible.create(collectible); //creates collectible
                    res.redirect(`/collectible/${collectibleID}`);
                    return;
                }
                else if (typeSelected == "2") { 
                    var selectFunko = 1;
                    if (!req.body.number) {
                        res.render('addcollectible', { 
                                selectFunko,
                                theName,
                                theNumber,
                                theLine,
                                message: 'Please add number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.line) {
                        res.render('addcollectible', { 
                                selectFunko,
                                theName,
                                theNumber,
                                theLine,
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
                    var selectPusheen = 1;
                    if (!req.body.product_type1) {
                        res.render('addcollectible', { 
                                selectPusheen,
                                theName,
                                theProductType1,
                                theSeason,
                                message: 'Please add product type',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.season) {
                        res.render('addcollectible', { 
                                selectPusheen,
                                theName,
                                theProductType1,
                                theSeason,
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
                    var selectPokemon = 1;
                    if (!req.body.product_type) {
                        res.render('addcollectible', { 
                                selectPokemon,
                                theName,
                                theProductType,
                                theGeneration,
                                message: 'Please add product type',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }

                    if (!req.body.generation) {
                        res.render('addcollectible', { 
                                selectPokemon,
                                theName,
                                theProductType,
                                theGeneration,
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
                    var selectHotWheels = 1;
                    if (!req.body.number1) {
                        res.render('addcollectible', { 
                                selectHotWheels,
                                theName,
                                theNumber1,
                                theSeries,
                                theYearReleased1,
                                message: 'Please add number',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.series) {
                        res.render('addcollectible', { 
                                selectHotWheels,
                                theName,
                                theNumber1,
                                theSeries,
                                theYearReleased1,
                                message: 'Please add series',
                                messageClass: 'alert-danger'
                            }
                        )
                        return
                    }
                    if (!req.body.year_released1) {
                        res.render('addcollectible', { 
                                selectHotWheels,
                                theName,
                                theNumber1,
                                theSeries,
                                theYearReleased1,
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
                            selectLego,
                            selectFunko,
                            selectPusheen,
                            selectPokemon,
                            selectHotWheels,
                        message: 'That collectible type does not exist',
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
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'Invalid name',
            messageClass: 'alert-danger'
            }   
        )
        return
    }
});


module.exports = router;