const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils')


router.get('/', requireAuth, (req, res, next) => {
    const { email, phone_number, username } = req.user;
    res.render('profile', { 
        email: email,
        phone_number: phone_number,
        title: `Collector's Trading Platform | ${username}`,
        username: username,
    });
});

module.exports = router;