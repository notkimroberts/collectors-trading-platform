const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('forgotPassword', { title: "Collector's Trading Platform | Forgot Password" });
});

module.exports = router;