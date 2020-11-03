const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('rules', { title: "Collector's Trading Platform | Rules" });
});

module.exports = router;