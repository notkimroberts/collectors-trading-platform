// https://stackoverflow.com/questions/47515991/how-to-setup-an-authentication-middleware-in-express-js/47516387

module.exports.isAuthorized  = function(req, res, next) {

    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {      
            if (user === null) {     
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                return next(err);
            } else {
                return next();
            }
        }
    });
}