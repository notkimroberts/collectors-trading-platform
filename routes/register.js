const express = require('express');
const router = express.Router();
const Collector = require('../models/Collector')


router.get('/', (req, res) => {
    res.render('register', { title: "Register" });
});


router.post('/', (req, res) => {
    Collector.create(req.body.username, req.body.password, req.body.email, req.body.phone_number)
});

module.exports = router;