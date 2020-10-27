const express = require('express');
const router = express.Router();
const collector = require('../models/collector')

router.get('/', (req, res, next) => {
    res.render('profile', { title: "Profile " });
});

module.exports = router;