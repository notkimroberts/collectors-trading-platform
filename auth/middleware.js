function ensureLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.redirect('/login');
    }
}


function allowAccess(req, res, next) {
    if (req.signedCookies.user_id == req.params.id) {
        next();
    }
    else {
        res.redirect('/');
    }
}

function restrictIfLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        res.redirect('/');
    }
    else {
        next();
    }
}

module.exports = {
    ensureLoggedIn,
    allowAccess,
    restrictIfLoggedIn
};