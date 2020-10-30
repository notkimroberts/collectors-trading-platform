//http://www.passportjs.org/packages/passport-jwt/

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const Collector = require('pg').model('Collector');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: "HS256", //https://jwt.io/introduction/
};
//https://stackoverflow.com/questions/36486397/passport-login-and-persisting-session
module.exports = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.user) {
        next();
    }
    // if they aren't redirect them to the login page
    else {
        res.redirect('/login');
    }
};

// // app.js will pass the global passport object here, and this function will configure it
// module.exports = (passport) => {
//     // The JWT payload is passed into the verify callback
//     passport.use(new JwtStrategy(options, function(jwt_payload, done) {

//         console.log(jwt_payload);
    
//        // http://www.passportjs.org/packages/passport-jwt/
//         User.findOne({_id: jwt_payload.sub}, function(err, user) {
            
//             // passportlocal
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//             }
            
//         });
        
//     }));
// }
