const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('quizResult', { title: "Collector's Trading Platform | Quiz Results" });
});


module.exports = router;