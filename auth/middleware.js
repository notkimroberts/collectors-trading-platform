function ensureLoggedIn(req, res, next) {
    console.log(req.signedCookies);
    if(req.signedCookies.user_id){
        next();
    }
    else{
        res.status(401);
        next(new Error('Unauthorized'))
    }

    //https://www.youtube.com/watch?v=EAjBjJgsnmU
}

module.exports = {
    ensureLoggedIn
};