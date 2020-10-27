const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('profile', {title: 'Profile'});
});

module.exports = router;