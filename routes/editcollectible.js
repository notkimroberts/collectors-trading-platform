const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');
const FileType = require('file-type');
const { types } = require('pg');
const { ensureLoggedIn } = require('../auth/middleware')


router.get('/', ensureLoggedIn, (req, res, next) => {
    res.render('editcollectible', { title: "edit collectible" });
});

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    const id = req.params.id;

    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: id }).first();

    if (collectibleData.collectible_type_id == 1) {
        var selectLego = 1;
    }

    if (collectibleData.collectible_type_id == 2) {
        var selectFunko = 1;
    }
    if (collectibleData.collectible_type_id == 3) {
        var selectPusheen = 1;
    }

    if (collectibleData.collectible_type_id == 4) {
        var selectPokemon = 1;
    }
    else if  (collectibleData.collectible_type_id == 5) {
        var selectHotWheels = 1;
    }

    res.render('editcollectible', { 
        title: "edit collectible", 
        id,
        selectLego,
        selectFunko,
        selectPusheen,
        selectPokemon,
        selectHotWheels,
    });
});

router.post('/', async (req, res, next) => {
    const { collectible_id, name } = req.body;
    const id = collectible_id;
   
    const typeSelected = req.body.collectible_type;
    const userId = req.signedCookies.user_id;

    const collectorData = await knex('collector')    
    .select('is_admin')
    .where({ collector_id: userId }).first();

    const userAdminType = collectorData.is_admin;
    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        res.render('editcollectible', { 
        title: "edit collectible", 
        id,
        selectLego,
        selectFunko,
        selectPusheen,
        selectPokemon,
        selectHotWheels,
        message: 'That collectible id does not exist',
        messageClass: 'alert-danger'
        }
        )
        return
    }
    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: collectible_id }).first();

    if (collectibleData.collectible_type_id == 1) {
        var selectLego = 1;
    }

    if (collectibleData.collectible_type_id == 2) {
        var selectFunko = 1;
    }
    if (collectibleData.collectible_type_id == 3) {
        var selectPusheen = 1;
    }

    if (collectibleData.collectible_type_id == 4) {
        var selectPokemon = 1;
    }
    else if  (collectibleData.collectible_type_id == 5) {
        var selectHotWheels = 1;
    }

    // Check if existing collectible name
    const thisIdcollectibleType = collectibleData.collectible_type_id;

    if (thisIdcollectibleType != userAdminType && userAdminType !='6')
    {
        res.render('editcollectible', { 
        title: "edit collectible", 
        id,
        selectLego,
        selectFunko,
        selectPusheen,
        selectPokemon,
        selectHotWheels,
        message: 'You do not have the admin privilege to edit this collectible',
        messageClass: 'alert-danger'
        }
    )
    return
    }

    if (await Collectible.getByName(name)) {
        res.render('editcollectible', { 
        title: "edit collectible", 
        id,
        selectLego,
        selectFunko,
        selectPusheen,
        selectPokemon,
        selectHotWheels,
        message: 'That collectible name already exists in the database. Unique names only',
        messageClass: 'alert-danger'
        }
        )
        return
    }

    if (typeSelected == "0") {
        if (!name && !req.files) {
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
            messageClass: 'alert-danger'
            }
            )
            return
        }
        
         if (name) {
             // update name
             await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
         }
         if (req.files) {
             const {data} = req.files.pic;
             if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
             }
         }
        // update updated_at time
        await knex('collectible').where({collectible_id: collectible_id}).update({updated_at: knex.fn.now()});
        res.redirect(`/collectible/${collectible_id}`);
    }

  if (typeSelected == '1') {
    
            if (userAdminType != "1" && userAdminType !='6'){
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'You do not have the admin privilege to edit to this collectible type',
                messageClass: 'alert-danger'
                }
            )
            return
            }

            if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'You do not have the admin privilege to edit to this collectible type',
                messageClass: 'alert-danger'
                }
            )
            return
            }
            if (thisIdcollectibleType != typeSelected && userAdminType == 6) {
                if (!req.body.piece_count) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add piece count. You must enter all type attribute fields if you are changing the collectible\'s type',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.set_number) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add set number. You must enter all type attribute fields if you are changing the collectible\'s type',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.theme) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add theme. You must enter all type attribute fields if you are changing the collectible\'s type',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.designed_by) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add designer. You must enter all type attribute fields if you are changing the collectible\'s type',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }



            }

            else if (!req.body.piece_count && !req.body.set_number && !req.body.theme && !req.body.designed_by) {
                if (!name && !req.files) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }
    
                if (name) {
                    // update name
                    await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
                }
            
                if (req.files) {
                    const {data} = req.files.pic;
                    if (data) {
                    // update image
                    await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
                    }
                }
    
                await knex('collectible')
                .where({collectible_id: collectible_id})
                .update({collectible_type_id: typeSelected})
                .update({updated_at: knex.fn.now()});
                
                res.redirect(`/collectible/${collectible_id}`);
                return
    
            }
            
            else {
                if (!req.body.piece_count) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add piece count',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.set_number) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add set number',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.theme) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add theme',
                    messageClass: 'alert-danger'
                    }
                    )
                    return
                }

                if (!req.body.designed_by) {
                    res.render('editcollectible', { 
                    title: "edit collectible", 
                    id,
                    selectLego,
                    selectFunko,
                    selectPusheen,
                    selectPokemon,
                    selectHotWheels,
                    message: 'Please add designer',
                        essageClass: 'alert-danger'
                    }
                    )
                    return
                }
            }

        if (name) {
            // update name
            await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
        }
    
        if (req.files) {
            const {data} = req.files.pic;
            if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
            }
        }

        await knex('collectible')
        .where({collectible_id: collectible_id})
        .update({collectible_type_id: typeSelected})
        .update({attributes: {  piece_count: req.body.piece_count, 
                                set_number: req.body.set_number, 
                                theme:  req.body.theme, 
                                designed_by: req.body.designed_by}})
        .update({updated_at: knex.fn.now()});

        res.redirect(`/collectible/${collectible_id}`);
    }

    if (typeSelected == '2') {

        if (userAdminType != "2" && userAdminType !='6'){
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType == 6) {

            if (!req.body.number) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add number. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }
            if (!req.body.line) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add line. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger',
                }
                )
                return
            }



        }

        else if (!req.body.number && !req.body.line) {
            if (!name && !req.files) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (name) {
                // update name
                await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
            }
        
            if (req.files) {
                const {data} = req.files.pic;
                if (data) {
                // update image
                await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
                }
            }

            await knex('collectible')
            .where({collectible_id: collectible_id})
            .update({collectible_type_id: typeSelected})
            .update({updated_at: knex.fn.now()});

            res.redirect(`/collectible/${collectible_id}`);
            return

        }

        else {
            if (!req.body.number) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add number',
                messageClass: 'alert-danger'
                }
                )
                return
            }
            if (!req.body.line) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add line',
                messageClass: 'alert-danger',
                }
                )
                return
            }
        }

        if (name) {
            // update name
            await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
        }
    
        if (req.files) {
            const {data} = req.files.pic;
            if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
            }
        }

        await knex('collectible')
        .where({collectible_id: collectible_id})
        .update({collectible_type_id: typeSelected})
        .update({attributes: {  number: req.body.number, 
                                line: req.body.line}})
        .update({updated_at: knex.fn.now()});

        res.redirect(`/collectible/${collectible_id}`);

    }


    if (typeSelected == '3') {

        if (userAdminType != "3" && userAdminType !='6'){
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType == 6) {
            if (!req.body.product_type1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add product type. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return

            }
            if (!req.body.season) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add season/holiday. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }

        }

        else if (!product_type1 && !req.body.season) {
            if (!name && !req.files) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (name) {
                // update name
                await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
            }
        
            if (req.files) {
                const {data} = req.files.pic;
                if (data) {
                // update image
                await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
                }
            }

            await knex('collectible')
            .where({collectible_id: collectible_id})
            .update({collectible_type_id: typeSelected})
            .update({updated_at: knex.fn.now()});

            res.redirect(`/collectible/${collectible_id}`);
            return


        }
        else {
            if (!req.body.product_type1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add product type',
                messageClass: 'alert-danger'
                }
                )
                return

            }
            if (!req.body.season) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add season/holiday',
                messageClass: 'alert-danger'
                    }
                )
                return
            }
        }
        if (name) {
            // update name
            await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
        }
    
        if (req.files) {
            const {data} = req.files.pic;
            if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
            }
        }

        await knex('collectible')
            .where({collectible_id: collectible_id})
            .update({collectible_type_id: typeSelected})
            .update({attributes: {  product_type: req.body.product_type1,
                                    season: req.body.season}})
            .update({updated_at: knex.fn.now()});

        res.redirect(`/collectible/${collectible_id}`);
        return
    }

    if (typeSelected == '4') {
    
        if (userAdminType != "4" && userAdminType !='6'){
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }
        if (thisIdcollectibleType != typeSelected && userAdminType == 6) {
            if (!req.body.product_type) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add product type. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.generation) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add generation. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }
        }

        else if (!req.body.product_type && !req.body.generation) {
            if (!name && !req.files) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (name) {
                // update name
                await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
            }
        
            if (req.files) {
                const {data} = req.files.pic;
                if (data) {
                // update image
                await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
                }
            }
            await knex('collectible')
            .where({collectible_id: collectible_id})
            .update({collectible_type_id: typeSelected})
            .update({updated_at: knex.fn.now()});
    
            res.redirect(`/collectible/${collectible_id}`);
            return;

        }

        else {
            if (!req.body.product_type) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add product type',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.generation) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add generation',
                messageClass: 'alert-danger'
                }
                )
                return
            }
        }

        if (name) {
            // update name
            await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
        }
    
        if (req.files) {
            const {data} = req.files.pic;
            if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
            }
        }

        await knex('collectible')
        .where({collectible_id: collectible_id})
        .update({collectible_type_id: typeSelected})
        .update({attributes: {  product_type: req.body.product_type,
                                generation: req.body.generation}})
        .update({updated_at: knex.fn.now()});

        res.redirect(`/collectible/${collectible_id}`);
    }

    if (typeSelected == '5') {

        
        if (userAdminType != "5" && userAdminType !='6'){
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
         return
        }

       if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
            title: "edit collectible", 
            id,
            selectLego,
            selectFunko,
            selectPusheen,
            selectPokemon,
            selectHotWheels,
            message: 'You do not have the admin privilege to edit to this collectible type',
            messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType == 6) {
            if (!req.body.number1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add number. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.series) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add series. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.year_released1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add year released. You must enter all type attribute fields if you are changing the collectible\'s type',
                messageClass: 'alert-danger'
                }
                )
                return
            }
        }

        else if (!req.body.number1 && !req.body.series && !req.body.year_released1) {
            if (!name && !req.files) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please do one of the following to update the collectible: enter a name, upload an image, or enter all the attribute fields',
                messageClass: 'alert-danger'
                }
                )
                return
            }
            if (name) {
                // update name
                await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
            }
        
            if (req.files) {
                const {data} = req.files.pic;
                if (data) {
                // update image
                await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
                }
            }
            await knex('collectible')
            .where({collectible_id: collectible_id})
            .update({collectible_type_id: typeSelected})
            .update({updated_at: knex.fn.now()});
    
            res.redirect(`/collectible/${collectible_id}`);
            return;

        }
        else {
            if (!req.body.number1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add number',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.series) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add series',
                messageClass: 'alert-danger'
                }
                )
                return
            }

            if (!req.body.year_released1) {
                res.render('editcollectible', { 
                title: "edit collectible", 
                id,
                selectLego,
                selectFunko,
                selectPusheen,
                selectPokemon,
                selectHotWheels,
                message: 'Please add year released',
                messageClass: 'alert-danger'
                }
                )
                return
            }
        }

         if (name) {
            // update name
            await knex('collectible').where({collectible_id: collectible_id}).update({name: name});
        }
    
        if (req.files) {
            const {data} = req.files.pic;
            if (data) {
            // update image
            await knex('collectible').where({collectible_id: collectible_id}).update({image: data});
            }
        }

        await knex('collectible')
        .where({collectible_id: collectible_id})
        .update({collectible_type_id: typeSelected})
        .update({attributes: {  number: req.body.number1, 
                                series: req.body.series,
                                year_released: req.body.year_released1}})
        .update({updated_at: knex.fn.now()});

        res.redirect(`/collectible/${collectible_id}`);
    }
});

module.exports = router;