
const passport = require('passport'),
CookieStrategy = require('../models/passport-cookie');

module.exports = function (data) {
passport.use(new CookieStrategy(function (token, done) {
    var user = data.filter(function (element, index, array) {
        return element.token === token;
    })[0];

    if (!user) {
        return done({message: 'Not found!'}, null);
    }

    done(null, user);
}));
};