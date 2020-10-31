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


// router.get('/', async (req, res, next) => {
//     const collector = await db('collector');
//     res.json({ data: collector, total: collector.length });
// });

module.exports = router;