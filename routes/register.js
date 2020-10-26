const express = require('express');
const router = express.Router();
const collector = require('../models/collector')

router.get('/', (req, res) => {
    res.render('register', { title: "Register" });
});

module.exports = router;