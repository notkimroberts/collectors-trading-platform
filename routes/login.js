const express = require('express');
const router = express.Router();
const Collector = require('../models/Collector')
const { authTokens, getHashedPassword, generateAuthToken } = require('../utils')


router.get('/', (req, res, next) => {
    res.render('login');
});


router.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    const user = await Collector.getByEmailAndPassword(email, hashedPassword);

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication token
        authTokens[authToken] = user;

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the profile page
        res.redirect('/profile');
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }

});

module.exports = router;