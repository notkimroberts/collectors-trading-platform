const express = require('express');
const db = require('../connection')
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');


router.get('/search/', async (req, res, next) => {
    const { username } = req.query;
    const collector = await Collector.getAll({ username })
    res.json(collector);
  });


router.get('/:username', async (req, res, next) => { 
    const username = req.params.username;
    const collector = await knex('collector').where({ username: username }).first();
    if (collector) {
        res.json({ data: collector});
    } else {
        res.end('No collector with that id!');
    }
});


module.exports = router;