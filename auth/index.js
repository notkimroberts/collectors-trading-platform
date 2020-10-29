const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Collector = require('../models/collector');
const passport = require('passport');

// routes paths are prepended with /auth
router.get('/', (req, res) => {
    res.json({
        message: '👨‍'
    });
});

// checks to see if email field has something in it and that password is at least 6 characters
function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=6;
    return validEmail && validPassword;
}

// post signup
// https://www.youtube.com/watch?v=H7qkTzxk_0I
router.post('/signup', (req, res, next) => {
    // if input is valid
    if(validUser(req.body)) {
        // check to see if a collector with email is already in database
        Collector
            .getOneByEmail(req.body.email)
            .then(collector => {
                console.log('collector', collector);
                // if a collector with that email is not found, then it is a unique email
                if(!collector) {
                // hash password and obtain fields
                bcrypt.hash(req.body.password, 10)
                    .then((hash) => {
                    const collector = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    phone_number: req.body.phone_number
                    };
                    // create the collector with the attributes from fields
                    Collector
                        .create(collector)
                        .then(collector_id => {
                            res.json({
                                collector_id,
                                message: 'unique user'
                            });
                        });
            });
            }
            // else a collector with that email exists
            else { // email in use
                next(new Error('Email in use'));
            }
            });
    // else fields were not valid
    } else 
    {
        next(new Error('Invalid user'));
    }
    
});

//https://stackoverflow.com/questions/44883228/how-to-get-the-express-session-variable-in-all-the-handlebars-pages-right-now-i
router.post('/profile',(req, res) => {
    const currentcollector = Collector.getOneByEmail(req.body.email);
    var email1 = currentcollector.email;
    res.render('Profile',
    {title: 'Welcome', email: email1});
});

// post login
// https://www.youtube.com/watch?v=cOCkn2R-aZc
router.post('/login', (req, res, next) => {
    // if input is valid
    if(validUser(req.body)) {
        Collector    
            .getOneByEmail(req.body.email)
            .then(collector => {
                const isSecure = req.app.get('env') != 'development';
                console.log('collector', collector, {
                    httpOnly: true,
                    secure: isSecure,
                    signed: true
                });
                // if the email the user inputted in email field is found
                if (collector) {
                    // hash the inputted password and check it against the collector's hashed password stored in the database
                    bcrypt
                        .compare(req.body.password, collector.password)
                        .then((result) => {
                            // if the passwords match, log in
                            if(result) {
                                console.log(req.body.email + ' has logged in successfully');
                                if (passport.authenticate(result)){
                                    res.status(200).json({ success: true, msg: "you are authenticated!" });
                                }
                                res.redirect('/');
                            }
                            // else invalid. the passwords did not match
                            else {
                                next(Error("You entered the wrong password"));
                                res.status(401).json({success: false, msg: "you entered the wrong password"});
                                res.redirect('/login'); //https://stackoverflow.com/questions/18739725/how-to-know-if-user-is-logged-in-with-passport-js
                            }
                    });
                }
                // else invalid. no email matched what was in the email field
                else {
                    next(Error("Invalid login"));
                }
    });
}
    // else fields were not valid
    else {
        next(new Error('Invalid login'));
    }
});

//https://github.com/zachgoll/express-session-authentication-starter/blob/master/routes/index.js
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// post logout
// https://www.youtube.com/watch?v=cOCkn2R-aZc
router.post('/logout', function (req, res) {
    console.log('Success logout!');
    res.redirect('/');
});


module.exports = router;
