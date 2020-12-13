const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Collector = require('../models/collector');


// routes paths are prepended with /auth
router.get('/', (req, res) => {
    res.json({
        message: '👨‍'
    });
});

// check to make sure user entered valid text in email and password fields
function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=8;

    return validEmail && validPassword;
}

// https://www.youtube.com/watch?v=H7qkTzxk_0I
// user registration
router.post('/register', (req, res, next) => {
    if(validUser(req.body)) {
        Collector
        .getByEmail(req.body.email) //validates email
        .then(collector => {

            // if user not found, then it is a unique email
            if(!collector) {
                Collector
                .getByUsername(req.body.username)
                .then(collector => {
                    // if user not found, then it is a unique username
                    if(!collector) {
                        //if user is is signing up as an admin, check promo codes
                        if (req.body.is_admin != 0) {
                            // if user did not enter promocode
                            if (!req.body.allpromos) {
                                res.render('register', {
                                    message: 'Please enter a code for the admin type selected',
                                    messageClass: 'alert-danger'
                                }
                                )
                                return
                            }

                            if (req.body.is_admin === "1") {
                                if (req.body.allpromos != "AAA20"){ //admin code for lego
                                    res.render('register', {
                                        message: 'Please enter valid code for Lego admin',
                                        messageClass: 'alert-danger'
                                    }
                                    )
                                    return
                                }
                            }

                            if (req.body.is_admin === "2") {
                                if (req.body.allpromos != "BBB20"){ //admin code for funko
                                    res.render('register', {
                                        message: 'Please enter valid code for Funko admin',
                                        messageClass: 'alert-danger'
                                    }
                                    )
                                    return
                                }
                            }

                            if (req.body.is_admin === "3") {
                                if (req.body.allpromos != "CCC20") { //admin code for pusheen
                                    res.render('register', {
                                        message: 'Please enter valid code for Pusheen admin',
                                        messageClass: 'alert-danger'
                                    }
                                    )
                                    return
                                }
                            }

                            if (req.body.is_admin === "4") {
                                if (req.body.allpromos != "RRR20"){ //admin code for pokemon
                                    res.render('register', {
                                        message: 'Please enter valid code for Pokemon admin',
                                        messageClass: 'alert-danger'
                                    }
                                    )
                                    return
                                }
                            }

                            if (req.body.is_admin === "5") {
                                if (req.body.allpromos != "DDD20") { //admin code for hot wheels
                                    res.render('register', {
                                        message: 'Please enter valid code for Hot Wheels admin',
                                        messageClass: 'alert-danger'
                                    }
                                    )
                                    return
                                }
                            }
                            if (req.body.is_admin === "6") {
                                if (req.body.allpromos != "REG20") { //admin code for admin type
                                    res.render('register', {
                                            message: 'Please enter valid code for all admin type',
                                            messageClass: 'alert-danger'
                                        }
                                    )
                                    return
                                }
                            }
                        }
                        // user has passed is_admin checks, now create the new user
                        // hash password
                        bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                            const collector = {
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                phone_number: req.body.phone_number,
                                is_admin: req.body.is_admin
                            };
                            Collector
                            .create(collector) //create a collector
                            .then(collector_id => {
                            });
                            res.render('login', {
                                message: 'Successfully created account. Please login to continue.',
                                messageClass: 'alert-success'
                                }
                            );
                            return
                        });
                    }
                    // username in use
                    else { 
                        res.render('register', {
                            message: 'Username in use. Please input a different username.',
                            messageClass: 'alert-danger'
                        });
                        return
                    }

                });
            }
            // email in use
            else { 
                res.render('register', {
                    message: 'Email in use. Please input a different email.',
                    messageClass: 'alert-danger'
                });
                return
            }
        });
      
    } 
    // email or password fields are invalid
    else {
        res.render('register', {
            message: 'Invalid email or password. Please match the requested format.',
            messageClass: 'alert-danger'
        });
        return
    }  
});

function setUserIdCookie(req, res, id) {
    const isSecure = req.app.get('env') != 'development';
    res.cookie('user_id', id, {
        httpOnly: true,
        secure: isSecure,
        signed: true

    });
}
router.post('/login', (req, res, next) => {
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
                                res.json({
                                    collector_id: collector.collector_id,
                                    message: 'logged in'
                                  });

                            }
                            else {
                                next(Error("Invalid login1"));
                            }


                    });


                }

                else {
                    next(Error("Invalid login2"));
                }


    });
}
    else {
        next(new Error('Invalid login3'));
    }
});

// logout user
router.get('/logout', (req, res) => {
    // clear cookie
    res.clearCookie('user_id');
    res.json({
        message: 'you are logged out'
    });
});


module.exports = router;