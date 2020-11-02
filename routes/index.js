const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    // TODO: How does this work?
    // const { userId } = req.session;
    res.render('home', { title: 'Collector\'s Trading Platform | Home' });
});

module.exports = router;