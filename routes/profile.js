const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils')


router.get('/', requireAuth, (req, res, next) => {
    res.render('profile', { username: req.user.username });
});

module.exports = router;