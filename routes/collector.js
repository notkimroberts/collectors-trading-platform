const express = require('express');
const db = require('../connection')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const collector = await db('collector');
    res.json({ data: collector, total: collector.length });
});

module.exports = router;