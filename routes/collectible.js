const db = require('../connection')
const express = require('express');
const router = express.Router();
const knex = require('../connection')
const Collector = require('../models/Collector')
const { getById } = require('../models/Collector');

router.get('/', async (req, res, next) => {
    res.render('collectible');
});

// router.post('/', async (req, res, next) => {
//     const collectible = getById(req.user.collector_id)
//     if (collectible) {
//     res.render('collectible', { name: req.collectible.name, image: req.collectible.image,
//         total_quantity: req.collectible.total_quantity});}
// });

module.exports = router;