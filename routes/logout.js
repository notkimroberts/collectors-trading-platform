const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('logout', { title: "Logout" });}
);


module.exports = router;