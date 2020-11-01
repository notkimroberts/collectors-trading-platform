const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('trade', { title: "Trade" });
});

module.exports = router;