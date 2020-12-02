const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');
const { ensureLoggedIn } = require('../auth/middleware')



router.get('/', ensureLoggedIn, async (req, res, next) => {
    const userId = req.signedCookies.user_id;

    const collectorData = await knex('collector')
    .select('is_admin')
    .where('collector_id', userId ).first();

    console.log(collectorData.is_admin);


    if (collectorData.is_admin == 6) {
        var showAllAttributes = 1;  

    //show the collectibles by id type
    const collectiblesUserCanDelete = await knex('collectible')
    .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
    .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
    .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
    .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))
    res.render('managecollectible', { 
        title: "manage collectible",
        collectibles: collectiblesUserCanDelete,
        showAllAttributes
     });

    }
    //based on admin show the specific collectible by type
    else if (collectorData.is_admin > 0 && collectorData.is_admin < 6) {
        if (collectorData.is_admin == 1) {
            var showLegoAttributes = 1;
        }
        else if (collectorData.is_admin == 2) {
            var showFunkoAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 3) {
            var showPusheenAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 4) {
            var showPokemonAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 5) {
            var showHotWheelsAttributes = 1;
        }    

        const collectiblesUserCanDelete = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
        .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))
        .where({ 'collectible.collectible_type_id': collectorData.is_admin });

        res.render('managecollectible', { 
            title: "manage collectible",
            collectibles: collectiblesUserCanDelete,
            showLegoAttributes,
            showFunkoAttributes,
            showPusheenAttributes,
            showPokemonAttributes,
            showHotWheelsAttributes,
         });
    }
    else {

        res.render('managecollectible', { 
            title: "manage collectible",
         });
    }


});

router.post('/', async (req, res, next) => {
    const collectible_id  = req.body.collectible_id;
    console.log(collectible_id);


    const userId = req.signedCookies.user_id;

    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: collectible_id }).first();

    console.log(collectibleData);

    //if collectible not available
    if (collectibleData == undefined) {
        res.render('managecollectible', { 
            message: 'No collectible with that id exists. Click on the Manage Collectibles link in the nav bar to refresh the table.',
            messageClass: 'alert-danger',
            title: "manage collectible",
            }   
            )
            return
    }


    const collectorData = await knex('collector')
    .select('is_admin')
    .where('collector_id', userId ).first();

    //if no admin privilege
    if (collectorData.is_admin != collectibleData.collectible_type_id && collectorData.is_admin != 6) {

        if (collectorData.is_admin == 6) {
            var showAllAttributes = 1;
            
            const collectiblesUserCanDelete = await knex('collectible')
            .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
            .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
            .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
            .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))

            res.render('managecollectible', { 
            message: 'You do not have the admin privilege to delete this collectible',
            messageClass: 'alert-danger',
            title: "manage collectible",
            collectibles: collectiblesUserCanDelete,
            showAllAttributes
            }   
            )
            return
        }

        else if (collectorData.is_admin > 0 && collectorData.is_admin < 6) {
            if (collectorData.is_admin == 1) {
                var showLegoAttributes = 1;
            }
            else if (collectorData.is_admin == 2) {
                var showFunkoAttributes = 1;
        
        
            }
            else if (collectorData.is_admin == 3) {
                var showPusheenAttributes = 1;
        
        
            }
            else if (collectorData.is_admin == 4) {
                var showPokemonAttributes = 1;
        
        
            }
            else if (collectorData.is_admin == 5) {
                var showHotWheelsAttributes = 1;
            }
        
        
            const collectiblesUserCanDelete = await knex('collectible')
            .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
            .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
            .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
            .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))
            .where({ 'collectible.collectible_type_id': collectorData.is_admin });

            res.render('managecollectible', { 
            message: 'You do not have the admin privilege to delete this collectible',
            messageClass: 'alert-danger',
            title: "manage collectible",
            collectibles: collectiblesUserCanDelete,
            showLegoAttributes,
            showFunkoAttributes,
            showPusheenAttributes,
            showPokemonAttributes,
            showHotWheelsAttributes,
            }   
            )
            return
        }
        else {

            res.render('managecollectible', { 
                message: 'You do not have the admin privilege to delete this collectible',
                messageClass: 'alert-danger',
                title: "manage collectible",
             });
        }
    }

    // delete collectible
    await knex('collectible')
    .where({collectible_id: collectible_id})
    .delete();

    if (collectorData.is_admin == 6) {

        var showAllAttributes = 1;

        
        const collectiblesUserCanDelete = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
        .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))
        res.render('managecollectible', { 
            message: 'Collectible has been deleted',
            messageClass: 'alert-success',
            title: "manage collectible",
            collectibles: collectiblesUserCanDelete,
            showAllAttributes
        });

    }

    else if (collectorData.is_admin > 0 && collectorData.is_admin < 6) {
        if (collectorData.is_admin == 1) {
            var showLegoAttributes = 1;
        }
        else if (collectorData.is_admin == 2) {
            var showFunkoAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 3) {
            var showPusheenAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 4) {
            var showPokemonAttributes = 1;
    
    
        }
        else if (collectorData.is_admin == 5) {
            var showHotWheelsAttributes = 1;
        }
    
    
        const collectiblesUserCanDelete = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.attributes', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .select(knex.raw("to_char(collectible.created_at, 'YYYY-MM-DD') as created_at"))
        .select(knex.raw("to_char(collectible.updated_at, 'YYYY-MM-DD') as updated_at"))
        .where({ 'collectible.collectible_type_id': collectorData.is_admin });

        res.render('managecollectible', { 
            message: 'Collectible has been deleted',
            messageClass: 'alert-success',
            title: "manage collectible",
            collectibles: collectiblesUserCanDelete,
            showLegoAttributes,
            showFunkoAttributes,
            showPusheenAttributes,
            showPokemonAttributes,
            showHotWheelsAttributes,
         });

    }

});

module.exports = router;