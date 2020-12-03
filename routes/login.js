const express = require('express');
const router = express.Router();
const { restrictIfLoggedIn } = require('../auth/middleware')
const bcrypt = require('bcrypt');
const Collector = require('../models/collector');

router.get('/', restrictIfLoggedIn, (req, res, next) => {
    res.render('login', { title: "Login" });
});

// check to make sure user entered valid text in email and password fields
function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=8;

    return validEmail && validPassword;
}

// function t oset cookie
function setUserIdCookie(req, res, id) {
    const isSecure = req.app.get('env') != 'development';
    res.cookie('user_id', id, {
        httpOnly: true,
        secure: isSecure,
        signed: true
    });
}

// user login
router.post('/', (req, res, next) => {
    // check to see if user is in database
    if(validUser(req.body)) {
        Collector    
        .getByEmail(req.body.email)
        .then(collector => {
            if (collector) {
                // check password against hashed password
                bcrypt
                .compare(req.body.password, collector.password)
                .then((result) => {
                    // if the passwords matched
                    if(result) {
                        // set set-cookie header
                        setUserIdCookie(req, res, collector.collector_id);
                        res.redirect('/profile');
                        return;
                    }
                    else {
                        // password does not match what we have in our database for that email address
                        res.render('login', {
                            message: 'Invalid login or password. Email and password are case sensitive.',
                            messageClass: 'alert-danger'
                            }
                        );
                        return
                    }
                
                });
            }
            // email does not exist in our database
            else {
                    res.render('login', {
                    message: 'Invalid login or password. Email and password are case sensitive.',
                    messageClass: 'alert-danger'
                    }
                );
                return
            }
        });
    }
    // email or password fields are invalid
    else {
        res.render('login', {
            message: 'Email or password field is invalid',
            messageClass: 'alert-danger'
            }
        );
        return
    }
});


module.exports = router;