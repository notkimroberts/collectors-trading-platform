const express = require('express');
const router = express.Router();
const { restrictIfLoggedIn } = require('../auth/middleware')
const bcrypt = require('bcrypt');
const Collector = require('../models/collector');

router.get('/', restrictIfLoggedIn, (req, res, next) => {
    res.render('login', { title: "Login" });
});

function validUser(collector) {
    const validEmail = typeof collector.email == 'string' && collector.email.trim() != '';
    const validPassword = typeof collector.password == 'string' && collector.password.trim() != '' && collector.password.trim().length >=6;

    return validEmail && validPassword;
}


function setUserIdCookie(req, res, id) {
    const isSecure = req.app.get('env') != 'development';
    res.cookie('user_id', id, {
        httpOnly: true,
        secure: isSecure,
        signed: true
    });
}

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
                            }
                            else {
                                res.render('login', {
                                    message: 'Invalid password',
                                    messageClass: 'alert-danger'
                                    }
                                );
                                return
                            }
                        
                        });
                }
                else {
                      res.render('login', {
                        message: 'no email',
                        messageClass: 'alert-danger'
                        }
                    );
                    return
                }
            });
    }
    else {
        res.render('login', {
            message: 'not a valid input',
            messageClass: 'alert-danger'
            }
        );
        return
    }
});


module.exports = router;