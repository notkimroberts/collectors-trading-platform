//this function checks to see if user is signed in based on cookies
function ensureLoggedIn(req, res, next) {
    if (req.signedCookies.user_id) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

//to allow user to sign in 
function allowAccess(req, res, next) {
    if (req.signedCookies.user_id == req.params.id) {
        next();
    }
    else {
        res.redirect('/');
    }
}

//redirect to main page after logging in
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