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

function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=6;

    return validEmail && validPassword;
}

// https://www.youtube.com/watch?v=H7qkTzxk_0I
router.post('/register', (req, res, next) => {
    if(validUser(req.body)) {
        Collector
            .getByEmail(req.body.email)
            .then(collector => {

                // if user not found, then it is a unique email
                if(!collector) {
                    Collector
                        .getByUsername(req.body.username)
                        .then(collector => {
                                // if user not found, then it is a username
                                if(!collector) {

                                    if(req.body.is_admin == 0){

                                        console.log("dont check for promocodes")
                                    }

                                    //else user is signing up as admin
                                    else{
                                        //promo codes go here
                                        if (!req.body.allpromos){
                                            res.render('register', {
                                                message: 'Promo code field is blank. Please enter a valid promocode for admin type',
                                                messageClass: 'alert-danger'
                                            }
                                        )
                                        return
                                        }
                                        else if (req.body.is_admin === "1"){
                                            if (req.body.allpromos != "AAA20"){
                                                res.render('register', {
                                                message: 'Please enter valid promocode for lego admin',
                                                    messageClass: 'alert-danger'
                                                }
                                            )
                                            return
                                        }
                                    }
                                    else if (req.body.is_admin === "2"){
                                        if (req.body.allpromos != "BBB20"){
                                            res.render('register', {
                                            message: 'Please enter valid promocode for funko admin',
                                                messageClass: 'alert-danger'
                                            }
                                        )
                                        return
                                    }
                                }
                                    else if (req.body.is_admin === "3"){
                                        if (req.body.allpromos != "CCC20"){
                                            res.render('register', {
                                            message: 'Please enter valid promocode for pusheen admin',
                                                messageClass: 'alert-danger'
                                            }
                                        )
                                        return
                                    }
                                }
                                    else if (req.body.is_admin === "4"){
                                        if (req.body.allpromos != "RRR20"){
                                            res.render('register', {
                                            message: 'Please enter valid promocode for pokemon admin',
                                                messageClass: 'alert-danger'
                                            }
                                        )
                                        return
                                    }
                                }
                                    else if (req.body.is_admin === "5"){
                                        if (req.body.allpromos != "DDD20"){
                                            res.render('register', {
                                            message: 'Please enter valid promocode for hot wheel admin',
                                                messageClass: 'alert-danger'
                                            }
                                        )
                                        return
                                    }
                                }
                                    else if (req.body.is_admin === "6"){
                                        if (req.body.allpromos != "REG20"){
                                            console.log(req.body.is_admin);
                                            res.render('register', {
                                                message: 'Please enter valid promocode for all admin type',
                                                    messageClass: 'alert-danger'
                                                }
                                            )
                                            return
                                        }
                                    }
                                    }
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
                                            .create(collector)
                                            .then(collector_id => {
                                            });
                                            res.redirect('/login');
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

    else  {
                // send an error
                res.render('register', {
                    message: 'Invalid fields',
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
                            console.log("logged in");
                                // ({
                                //     collector_id: collector.collector_id,
                                //     message: 'logged in'
                                //   });
                                res.redirect('../');
                            }
                            else {
                                console.log("Hell32o");

                                res.render('login', {
                                    message: 'Invalid login',
                                    messageClass: 'alert-danger'
                                    }
                                );
                                return
                            }
                        
                        });
                }
                else {
                    console.log("Hell111o");

                    res.render('./login', {
                        message: 'Invalid login',
                        messageClass: 'alert-danger'
                        }
                    );
                    return
                }
            });
    }
    else {
        console.log("Hello");

        res.render('login', {
            message: 'Invalid login',
            messageClass: 'alert-danger'
            }
        );
        return
    }
});


router.get('/logout', (req, res) => {

    res.clearCookie('user_id');
    res.json({
        message: 'you are logged out'
    });
});


module.exports = router;