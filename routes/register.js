const express = require('express');
const router = express.Router();
const collector = require('../models/collector')

router.get('/', (req, res) => {
    res.render('register', { title: "Register" });
});

router.post('/', (req, res) => {
    collector.createUser(req.body.username, req.body.password, req.body.email, req.body.phone_number)
});

module.exports = router;