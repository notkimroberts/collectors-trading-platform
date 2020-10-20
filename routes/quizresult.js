const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('quizresult', { title: "Quiz Results" });
});


module.exports = router;