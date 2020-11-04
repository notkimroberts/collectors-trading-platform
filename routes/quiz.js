const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('quiz', { title: "Collector's Trading Platform | Quiz" });
});


module.exports = router;