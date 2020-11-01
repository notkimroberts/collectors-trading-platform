const express = require('express');
const FileType = require('file-type');
const knex = require('../connection')
const router = express.Router();


router.get('/', async (req, res, next) => {
    res.render('collectible');
});


router.get('/search/', async (req, res, next) => {
    const { name } = req.query;
    const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible').where('name', 'ilike', `%${name}%`);
    res.render('collectible', {
        page_title: 'The title for collectible page',
        collectible: collectibles
  });
});


router.get('/image/:id', async (req, res, next) => { 
    const id = req.params.id;
    const collectible = await knex('collectible').where({collectible_id: id}).first();
    if (collectible) {
        const contentType = await FileType.fromBuffer(collectible.image);
        res.type(contentType.mime);
        res.end(collectible.image);
    } else {
        res.end('No image with that id!');
    }
});


router.get('/:id', async (req, res, next) => { 
    const id = req.params.id;
    const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible').where({collectible_id: id});
    res.render('collectible', {
        title: 'The title for collectible page',
        collectible: collectibles,
    });
});


router.get('/', async (req, res, next) => { 
    const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible');
    res.render('collectible', {
        page_title: 'The title for collectible page',
        collectible: collectibles
    });
});

module.exports = router;