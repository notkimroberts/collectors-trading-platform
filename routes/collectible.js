const db = require('../connection')
const express = require('express');
const router = express.Router();
const Collectible = require('../models/Collectible.js');


/* router.get('/', async (req, res, next) => {
    const collectible = await db('collectible');
    res.json({ data: collectible, total: collectible.length });
}); */


router.get('/', (req, res, next) => {
    const { name } = req.query;

    // get collectible by name
    Collectible.getAll({ name }).then(collectible => {
      res.json(collectible);
    });
  });

module.exports = router;