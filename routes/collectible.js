const Collectible = require('../models/Collectible.js');
const FileType = require('file-type');
const express = require('express');
const knex = require('../connection')
const router = express.Router();


/* 
router.get('/', async (req, res, next) => {
    const collectible = await db('collectible');
    res.json({ data: collectible, total: collectible.length });
});

 */



// display seach results
router.get('/search/', async (req, res, next) => {
  const { name } = req.query;
  console.log(name);

    const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible').where('name', 'ilike', `%${name}%`);
    res.render('collectible', {
      page_title: 'The title for collectible page',
      collectible: collectibles
  });

});


  // display the image of a collectible_id
// with help from https://www.youtube.com/watch?v=SAUvlkTDMM4
router.get('/image/:id', async (req, res, next) => { 
  const id = req.params.id;
  const collectible = await knex('collectible').where({collectible_id: id}).first();
  if (collectible) {
      

      const contentType = await FileType.fromBuffer(collectible.image); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
      res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
      res.end(collectible.image);

  } else {
      res.end('No image with that id!');
  }
});



// // display specific collectible_id
router.get('/:id', async (req, res, next) => { 
  const id = req.params.id;
  console.log(id);
  const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible').where({collectible_id: id});
      
  console.log(collectibles);

    res.render('collectible', {
      page_title: 'The title for collectible page',
      collectible: collectibles

});
});




// display all collectibles
// https://stackoverflow.com/questions/36111414/how-to-access-knex-query-results
router.get('/', async (req, res, next) => { 
  
  const collectibles = await knex.select('collectible_id', 'name', 'total_quantity', 'attributes', 'image').from('collectible');

    res.render('collectible', {
      page_title: 'The title for collectible page',
      collectible: collectibles

});

});


 
/* // route for specific collectible name. collectible name spaces are dashes for readibility
router.get('/:name', async (req, res, next) => { 
  var string = req.params.name;
  console.log(string);
  name = string.replace(/-/g, ' '); // convert dashes to spaces
  console.log(name);

  const collectible = await knex('collectible').where({name: name}).first();

  if (collectible) {
      
    res.json({ data: collectible});
      

  } else {
      res.end('No collectible with that name!');
  }
}); */



module.exports = router;