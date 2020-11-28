const express = require('express');
const knex = require('../connection')
const router = express.Router();
const Collectible = require('../models/collectible');


router.get('/', (req, res, next) => {
    res.render('deletecollectible', { title: "delete collectible" });
});

router.post('/', async (req, res, next) => {

    const { collectible_id } = req.body;
    const collectibleData = await knex('collectible')    
    .select('collectible_type_id')
    .where({ collectible_id: collectible_id }).first();
    const typeSelected = collectibleData.collectible_type_id;
    const userId = req.signedCookies.user_id;

    // Check if existing collectible_id
    if (!(await Collectible.getById(collectible_id))) {
        console.log("Hello");
        res.render('deletecollectible', { 
                message: 'That collectible id does not exist',
                messageClass: 'alert-danger'
            }
        )
        return
    }
    if (typeSelected == '1') {
        const collectibleData = await knex('collectible')
        .select('collectible_id', 'collectible_type_id')
        .where({collectible_id: collectible_id});
        knex.table('collectible').pluck('collectible_type_id').where('collectible_id', collectible_id).then(async function(ids) { 
            const collectibleType = '1';    
            var s = ids.includes(collectibleType);
            if (s == true)   {
                const collectorData = await knex('collector')
                .select('username', 'email', 'phone_number', 'collector_id')
                .where('collector_id', userId );
                knex.table('collector').pluck('is_admin').where('collector_id', userId ).then(async function(ids) { 
                    const collectibleType = '1';  
                    var n = ids.includes(collectibleType);
                    const collectibleAll = '6';
                    var z = ids.includes(collectibleAll);
                    if (n == true || z == true)
                    {
                        await knex('collectible')
                        .where({collectible_id: collectible_id})
                        .delete();
                    
                            res.render('deletecollectible', { 
                                message: 'Collectible has been deleted',
                                messageClass: 'alert-success'
                            }
                        )  
                        return
                }
                else{
                    res.render('deletecollectible', { 
                        message: 'You do not have the admin privilege to edit this collectible',
                        messageClass: 'alert-danger'
                        }   
                    )
                        return
                }
    });
}
        });
    }
    if (typeSelected == '2') {
        const collectibleData = await knex('collectible')
        .select('collectible_id', 'collectible_type_id')
        .where({collectible_id: collectible_id});
        knex.table('collectible').pluck('collectible_type_id').where('collectible_id', collectible_id).then(async function(ids) { 
            const collectibleType = '2';    
            var s = ids.includes(collectibleType);
            if (s == true)   {
                const collectorData = await knex('collector')
                .select('username', 'email', 'phone_number', 'collector_id')
                .where('collector_id', userId );
                knex.table('collector').pluck('is_admin').where('collector_id', userId ).then(async function(ids) { 
                    const collectibleType = '2';  
                    var n = ids.includes(collectibleType);
                    const collectibleAll = '6';
                    var z = ids.includes(collectibleAll);
                    if (n == true || z == true)
                    {
                        await knex('collectible')
                        .where({collectible_id: collectible_id})
                        .delete();
                    
                            res.render('deletecollectible', { 
                                message: 'Collectible has been deleted',
                                messageClass: 'alert-success'
                            }
                        )  
                        return
                    }
                    else{
                        res.render('deletecollectible', { 
                            message: 'You do not have the admin privilege to edit this collectible',
                            messageClass: 'alert-danger'
                            }   
                        )
                            return
                    }
                });
            }
                    });
                }
                if (typeSelected == '3') {
                    const collectibleData = await knex('collectible')
        .select('collectible_id', 'collectible_type_id')
        .where({collectible_id: collectible_id});
        knex.table('collectible').pluck('collectible_type_id').where('collectible_id', collectible_id).then(async function(ids) { 
            const collectibleType = '3';    
            var s = ids.includes(collectibleType);
            if (s == true)   {
                const collectorData = await knex('collector')
                .select('username', 'email', 'phone_number', 'collector_id')
                .where('collector_id', userId );
                knex.table('collector').pluck('is_admin').where('collector_id', userId ).then(async function(ids) { 
                    const collectibleType = '3';  
                    var n = ids.includes(collectibleType);
                    const collectibleAll = '6';
                    var z = ids.includes(collectibleAll);
                    if (n == true || z == true)
                    {
                        await knex('collectible')
                        .where({collectible_id: collectible_id})
                        .delete();
                    
                            res.render('deletecollectible', { 
                                message: 'Collectible has been deleted',
                                messageClass: 'alert-success'
                            }
                        )  
                        return
                    }
                    else{
                        res.render('deletecollectible', { 
                            message: 'You do not have the admin privilege to edit this collectible',
                            messageClass: 'alert-danger'
                            }   
                        )
                            return
                    }
                });
            }
                    });
                }
                if (typeSelected == '4') {
                    console.log('hello');
        const collectibleData = await knex('collectible')
        .select('collectible_id', 'collectible_type_id')
        .where({collectible_id: collectible_id});
        knex.table('collectible').pluck('collectible_type_id').where('collectible_id', collectible_id).then(async function(ids) { 
            const collectibleType = '4';    
            var s = ids.includes(collectibleType);
            if (s == true)   {
                const collectorData = await knex('collector')
                .select('username', 'email', 'phone_number', 'collector_id')
                .where('collector_id', userId );
                knex.table('collector').pluck('is_admin').where('collector_id', userId ).then(async function(ids) { 
                    const collectibleType = '4';  
                    var n = ids.includes(collectibleType);
                    const collectibleAll = '6';
                    var z = ids.includes(collectibleAll);
                    if (n == true || z == true)
                    {
                        await knex('collectible')
                        .where({collectible_id: collectible_id})
                        .delete();
                    
                            res.render('deletecollectible', { 
                                message: 'Collectible has been deleted',
                                messageClass: 'alert-success'
                            }
                        )  
                        return
                    }
                    else{
                        res.render('deletecollectible', { 
                            message: 'You do not have the admin privilege to edit this collectible',
                            messageClass: 'alert-danger'
                            }   
                        )
                            return
                    }
                });
            }
                    });
                }
                if (typeSelected == '5') {
                    const collectibleData = await knex('collectible')
        .select('collectible_id', 'collectible_type_id')
        .where({collectible_id: collectible_id});
        knex.table('collectible').pluck('collectible_type_id').where('collectible_id', collectible_id).then(async function(ids) { 
            const collectibleType = '5';    
            var s = ids.includes(collectibleType);
            if (s == true)   {
                const collectorData = await knex('collector')
                .select('username', 'email', 'phone_number', 'collector_id')
                .where('collector_id', userId );
                knex.table('collector').pluck('is_admin').where('collector_id', userId ).then(async function(ids) { 
                    const collectibleType = '5';  
                    var n = ids.includes(collectibleType);
                    const collectibleAll = '6';
                    var z = ids.includes(collectibleAll);
                    if (n == true || z == true)
                    {
                        await knex('collectible')
                        .where({collectible_id: collectible_id})
                        .delete();
                    
                            res.render('deletecollectible', { 
                                message: 'Collectible has been deleted',
                                messageClass: 'alert-success'
                            }
                        )  
                        return
                    }
                    else{
                        res.render('deletecollectible', { 
                            message: 'You do not have the admin privilege to edit this collectible',
                            messageClass: 'alert-danger'
                            }   
                        )
                            return
                    }
                });
            }
                    });
                }
            });

module.exports = router;