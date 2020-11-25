const express = require('express');
const router = express.Router();
const { restrictIfLoggedIn } = require('../auth/middleware')

router.get('/', restrictIfLoggedIn, (req, res, next) => {
    res.render('register', { title: "Register"});
});

module.exports = router;