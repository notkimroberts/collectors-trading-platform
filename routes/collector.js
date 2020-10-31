const express = require('express');
const db = require('../connection')
const router = express.Router();
const Collector = require('../models/Collector.js');


router.get('/', (req, res, next) => {
    const { username } = req.query;

    // get collectible by name
    Collector.getAll({ username }).then(collector => {
      res.json(collector);
    });
  });


module.exports = router;