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

router.get('/', (req, res, next) => {
    const { name } = req.query;

    // get collectible by name
    Collectible.getAll({ name }).then(collectible => {
      res.json(collectible);
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



// route for specific collectible_id
router.get('/:id', async (req, res, next) => { 
  const id = req.params.id;
  const collectible = await knex('collectible').where({collectible_id: id}).first();;
  if (collectible) {
      
    res.json({ data: collectible});
      

  } else {
      res.end('No collectible with that id!');
  }
});


 
/* // route for specific collectible name. collectible name spaces are dashes for readibility
router.get('/:name', async (req, res, next) => { 
  var string = req.params.name;
  console.log(string);
  name = string.replace(/-/g, ' '); // convert dashes to spaces
  console.log(name);
  const collectible = await knex('collectible').where({name: name}).first();;
  if (collectible) {
      
    res.json({ data: collectible});
      

  } else {
      res.end('No collectible with that name!');
  }
}); */



module.exports = router;