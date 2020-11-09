const express = require('express');
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/collector');


router.get('/search', async (req, res, next) => {
  const { username } = req.query;
  const collectors = await knex('collector')
    .select('collector.collector_id', 'collector.username', 'collector.email', 'collector.phone_number', 'collector.is_admin')
    .where('collector.username', 'ilike', `%${username}%`);
  res.render('collector', {
      title: `Collector\'s Trading Platform | Search Results`,
      collector: collectors,  });
  });

router.get('/:id', async (req, res, next) => { 
    const { id } = req.params;
    const collectors = await knex('collector')
        .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
        .where({ collector_id: id });

    res.render('collectorpage', {
        title: `Collector\'s Trading Platform | ${id}`,
        collector: collectors  });
    
});

router.get('/trade/:id', async (req, res, next) => { 
  const { id } = req.params; // other collector's id
  const userId = req.signedCookies.user_id; // logged in collector's id

  // logged in user data
  const collectorData1 = await knex('collector')
    .select('username as loggedInUsername', 'collector_id as loggedInId')
    .where('collector_id', userId);

  // the other collector's user data
  const collectorData2 = await knex('collector')
      .select('collector_id', 'username', 'email', 'phone_number', 'is_admin')
      .where({ collector_id: id });

  res.render('trade', {
      title: `Collector\'s Trading Platform | Trade Match`,
      collector1: collectorData1,
      collector2: collectorData2 });
  
});

module.exports = router;