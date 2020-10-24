const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../sql/users');


// routes paths are prepended with /auth
router.get('/', (req, res) => {
    res.json({
        message: '👨‍'
    });
});

function validUser(user) {
    const validEmail = typeof user.email == 'string' && user.email.trim() != '';
    const validPassword = typeof user.password == 'string' && user.password.trim() != '' && user.password.trim().length >=6;

    return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
    if(validUser(req.body)) {
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                console.log('user', user);
                // if user not found
                if(!user) {
                // then it is a unique email
                // hash password
                bcrypt.hash(req.body.password, 10)
                    .then((hash) => {
                    const user = {
                    email: req.body.email,
                    password: hash,
                    created_at: new Date()
                    };
                    User
                        .create(user)
                        .then(id => {
                            res.json({
                                id,
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
        User    
            .getOneByEmail(req.body.email)
            .then(user => {
                const isSecure = req.app.get('env') != 'development';
                console.log('user', user, {
                    httpOnly: true,
                    secure: isSecure,
                    signed: true
    

                });
                if (user) {
                    // check password against hashed password
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then((result) => {

                            if(result) {
                                // set set-cookie header
                                res.cookie('user_id', user.id)
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