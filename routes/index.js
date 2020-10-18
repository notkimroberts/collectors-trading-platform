const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('index', { title: "Collector's Trading Platform" });
});

router.get('/', (req, res, next) => {
    res.render('profile', { title: "Profile" });
});

router.get('/', (req, res, next) => {
    res.render('rules', { title: "Rules" });
});


module.exports = router;