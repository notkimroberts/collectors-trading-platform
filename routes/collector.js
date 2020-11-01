const Collector = require('../models/Collector.js');
const express = require('express');
const db = require('../connection')
const router = express.Router();
const knex = require('../connection')



router.get('/', (req, res, next) => {
    const { username } = req.query;

    // get collectible by name
    Collector.getAll({ username }).then(collector => {
      res.json(collector);
    });
  });



    // route for specific collector by username
    router.get('/:username', async (req, res, next) => { 
      const username = req.params.username;
      const collector = await knex('collector').where({username: username}).first();;
      if (collector) {
    
        res.json({ data: collector});
    
    
      } else {
          res.end('No collector with that id!');
      }
    });


// router.get('/', async (req, res, next) => {
//     const collector = await db('collector');
//     res.json({ data: collector, total: collector.length });
// });

module.exports = router;