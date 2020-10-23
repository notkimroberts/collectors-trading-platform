const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('forgotpw', { title: "Forgot Password" });
});

module.exports = router;