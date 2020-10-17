const express = require('express');
const db = require('../connection')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const collectible = await db('collectible');
    res.json({ data: collectible, total: collectible.length });
});

module.exports = router;