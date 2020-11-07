const express = require('express');
const router = express.Router();


router.get('/', requireAuth, (req, res, next) => {
    res.render('logout', { title: "Logout" });
});

router.post('/', requireAuth, function (req, res) {
    res.clearCookie(authTokens);
    res.redirect('/login');
    // req.session.destroy(err => {
    //     if (err) {
    //         return res.redirect('/');
    //     }
    //     res.clearCookie(authTokens);
    //     res.redirect('/login');
    // })
});

module.exports = router;