const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('collectorpagelist', { title: "Collector's Trading Platform | Trade" });
});

module.exports = router;