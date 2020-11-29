const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');
const FileType = require('file-type');
const { types } = require('pg');


router.get('/', (req, res, next) => {
    res.render('editcollectible', { title: "edit collectible" });
});

router.post('/', async (req, res, next) => {
    const { collectible_id, name } = req.body;
   
    const typeSelected = req.body.collectible_type;
    const userId = req.signedCookies.user_id;

    const collectorData = await knex('collector')    
    .select('is_admin')
    .where({ collector_id: userId }).first();

    const userAdminType = collectorData.is_admin;
    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        res.render('editcollectible', { 
                message: 'That collectible id does not exist',
                messageClass: 'alert-danger'
            }
        )
        return
    }
    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: collectible_id }).first();
    // Check if existing collectible name
    const thisIdcollectibleType = collectibleData.collectible_type_id;

    if (await Collectible.getByName(name)) {
        res.render('editcollectible', { 
                message: 'That collectible name already exists in the database. Unique names only.',
                messageClass: 'alert-danger'
            }
        )
        return
    }
    if (thisIdcollectibleType != userAdminType && userAdminType !='6')
    {
        res.render('editcollectible', { 
            message: 'User does not have the admin privilege to     edit',
            messageClass: 'alert-danger'
        }
    )
    return
    }

    if (typeSelected == "0") {
        if (!name && !req.files) {
            res.render('editcollectible', { 
                    message: 'Please enter a name or upload an image to update the collectible',
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
                    message: 'User does not have the admin privilege to edit',
                    messageClass: 'alert-danger'
                }
            )
            return
            }

            if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
                res.render('editcollectible', { 
                    message: 'User does not have the admin privilege to edit',
                    messageClass: 'alert-danger'
                }
            )
            return
            }

            if (!req.body.piece_count) {
                res.render('editcollectible', { 
                        message: 'Please add piece count',
                        messageClass: 'alert-danger'
                    }
                )
                return
            }

            if (!req.body.set_number) {
                res.render('editcollectible', { 
                        message: 'Please add set number',
                        messageClass: 'alert-danger'
                    }
                )
                return
            }

            if (!req.body.theme) {
                res.render('editcollectible', { 
                        message: 'Please add theme',
                        messageClass: 'alert-danger'
                    }
                )
                return
            }

            if (!req.body.designed_by) {
                res.render('editcollectible', { 
                        message: 'Please add designer',
                        messageClass: 'alert-danger'
                    }
                )
                return
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
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (!req.body.number) {
            res.render('editcollectible', { 
                    message: 'Please add number',
                    messageClass: 'alert-danger'
                }
            )
            return
        }
        if (!req.body.line) {
            res.render('editcollectible', { 
                    message: 'Please add line',
                    messageClass: 'alert-danger'
                }
            )
            return
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


    if (typeSelected == '3') {

        if (userAdminType != "3" && userAdminType !='6'){
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (!req.body.product_type1) {
            res.render('editcollectible', { 
                    message: 'Please add product type',
                    messageClass: 'alert-danger'
                }
            )
            return
        }
        if (!req.body.season) {
            res.render('editcollectible', { 
                    message: 'Please add season/holiday',
                    messageClass: 'alert-danger'
                }
            )
            return
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

    if (typeSelected == '4') {
    
        if (userAdminType != "4" && userAdminType !='6'){
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (!req.body.product_type) {
            res.render('editcollectible', { 
                    message: 'Please add product type',
                    messageClass: 'alert-danger'
                }
            )
            return
        }

        if (!req.body.generation) {
            res.render('editcollectible', { 
                    message: 'Please add generation',
                    messageClass: 'alert-danger'
                }
            )
            return
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

    if (typeSelected == '5') {
        
        if (userAdminType != "5" && userAdminType !='6'){
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (thisIdcollectibleType != typeSelected && userAdminType != 6) {
            res.render('editcollectible', { 
                message: 'User does not have the admin privilege to edit',
                messageClass: 'alert-danger'
            }
        )
        return
        }

        if (!req.body.series) {
            res.render('editcollectible', { 
                    message: 'Please add series',
                    messageClass: 'alert-danger'
                }
            )
            return
        }

        if (!req.body.year_released1) {
            res.render('editcollectible', { 
                    message: 'Please add year released',
                    messageClass: 'alert-danger'
                }
            )
            return
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

    else {
        res.render('editcollectible', { 
            message: 'an error ocurred',
            messageClass: 'alert-danger'
        }
    )
    return
}

    }
    

});

module.exports = router;