const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('contact', { title: "Collector's Trading Platform | Contact" });
});

module.exports = router;