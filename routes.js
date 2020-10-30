var auth = require('./authent');

// GET route after registering
router.get('/profile', auth.isAuthorized, function (req, res, next) {
    res.sendFile(path.join(__dirname + '/../views/profile.hbs'));
});
//https://stackoverflow.com/questions/47515991/how-to-setup-an-authentication-middleware-in-express-js/47516387