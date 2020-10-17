const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('rules', { title: "Collector's Trading Platform" });
});

module.exports = router;