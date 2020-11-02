const express = require('express');
const FileType = require('file-type');
const knex = require('../connection')
const router = express.Router();


router.get('/', async (req, res, next) => { 
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')

    res.render('collectible', {
        title: "Collector\'s Trading Platform | Collectibles",
        collectible: collectibles,
    });
});


router.get('/search/', async (req, res, next) => {
    console.log('hi')
    const { name } = req.query;
    console.log(name)
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .where('collectible.name', 'ilike', `%${name}%`);
    res.render('collectible', {
        title: "Collector\'s Trading Platform | Search Results",
        collectible: collectibles,
  });
});


router.get('/:id', async (req, res, next) => { 
    const { id } = req.params;
    const collectibles = await knex('collectible')
        .join('collectible_type', 'collectible.collectible_type_id', '=', 'collectible_type.collectible_type_id')
        .select('collectible.collectible_id', 'collectible_type.name as type_name', 'collectible.name', 'collectible.attributes', 'collectible.image', 'collectible.collectible_type_id')
        .where({ collectible_id: id });
    res.render('collectible', {
        title: `Collector\'s Trading Platform | ${id}`,
        collectible: collectibles,
    });
});


router.get('/image/:id', async (req, res, next) => { 
    const id = req.params.id;
    const collectible = await knex('collectible').where({ collectible_id: id }).first();
    if (collectible) {
        const contentType = await FileType.fromBuffer(collectible.image);
        res.type(contentType.mime);
        res.end(collectible.image);
    } else {
        res.end('No image with that id!');
    }
});


module.exports = router;