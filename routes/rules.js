const express = require('express');
const router = express.Router();


router.get('/rules', (req, res, next) => {
    res.render('rules', { title: "Collector's Trading Platform" });
});

module.exports = router;