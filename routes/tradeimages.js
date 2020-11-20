const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('tradeimages', { title: "Collector's Trading Platform | Trade" });
});

module.exports = router;