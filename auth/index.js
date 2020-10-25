const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Collector = require('../sql/users');

// routes paths are prepended with /auth
router.get('/', (req, res) => {
    res.json({
        message: '👨‍'
    });
});

// checks to see if email field has something in it and that password is atleast 6 characters
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
                                // set set-cookie header
                           //     res.cookie('user_id', user.id)
                                res.json({
                                    message: 'logged in'
                                  });

                            }
                            // else invalid. the passwords did not match
                            else {
                                next(Error("Invalid login"));
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

module.exports = router;
