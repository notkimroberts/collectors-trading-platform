function ensureLoggedIn(req, res, next) {
    console.log(req.signedCookies);
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        console.log(res.status(401));
        res.redirect('/login');
    }
}


function allowAccess(req, res, next) {
    if (req.signedCookies.user_id == req.params.id) {
        next();
    }
    else {
        console.log(res.status(401));
        res.redirect('/');
    }
}

function restrictIfLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        console.log(res.status(401));
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