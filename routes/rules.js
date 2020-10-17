const express = require('express');
const router = express.Router();


router.get('/rules', (req, res, next) => {
    res.render('rules', { title: "Rules" });
});

module.exports = router;