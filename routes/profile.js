const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils')

router.get('/', requireAuth, (req, res, next) => {
    res.render('profile', { username: req.user.username, email: req.user.email, phone_number: req.user.phone_number });
});

module.exports = router;