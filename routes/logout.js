const express = require('express');
const router = express.Router();
const { requireAuth, authTokens } = require('../utils')


router.get('/', requireAuth, (req, res, next) => {
    res.render('logout', { title: "Logout" });
});

router.post('/', requireAuth, function (req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
    res.clearCookie(authTokens);
    res.redirect('/login');
})
});

module.exports = router;