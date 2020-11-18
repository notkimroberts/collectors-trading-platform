const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('rating', { title: "Collector's Trading Platform | Rating" });
});

module.exports = router;