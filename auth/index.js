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

function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=6;
    return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
    if(validUser(req.body)) {
        Collector
            .getOneByEmail(req.body.email)
            .then(collector => {
                console.log('collector', collector);
                // if user not found
                if(!collector) {
                // then it is a unique email
                // hash password
                bcrypt.hash(req.body.password, 10)
                    .then((hash) => {
                    const collector = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    phone_number: req.body.phone_number
                    };
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
            else { // email in use
                next(new Error('Email in use'));
            }
            });
    } else 
    {// send an error
        next(new Error('Invalid user'));
    }
    
});

router.post('/login', (req, res, next) => {
    // check to see if user is in database
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
                if (collector) {
                    // check password against hashed password
                    bcrypt
                        .compare(req.body.password, collector.password)
                        .then((result) => {

                            if(result) {
                                // set set-cookie header
                           //     res.cookie('user_id', user.id)
                                res.json({
                                    message: 'logged in'
                                  });

                            }
                            else {
                                next(Error("Invalid login"));
                            }
                    });
                }
                else {
                    next(Error("Invalid login"));
                }
    });
}
    else {
        next(new Error('Invalid login'));
    }
});

module.exports = router;