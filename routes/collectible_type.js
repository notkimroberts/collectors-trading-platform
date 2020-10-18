const express = require('express');
const db = require('../connection')
const router = express.Router();

router.get('/', async (req, res, next) => {
    const collectible_type = await db('collectible_type');
    res.json({ data: collectible_type, total: collectible_type.length });
});

module.exports = router;