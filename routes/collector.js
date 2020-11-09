const express = require('express');
const db = require('../connection')
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');


router.get('/search/', async (req, res, next) => {
  const { username } = req.query;
  const collectors = await knex('collector')
  .select('collector.collector_id', 'collector.username', 'collector.email', 'collector.phone_number', 'collector.is_admin')
  .where('collector.username', 'ilike', `%${username}%`);
  res.render('collector', {
      title: "Collector\'s Trading Platform | Search Results",
      collector: collectors,  });
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