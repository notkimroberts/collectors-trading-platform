const express = require('express');
const router = express.Router();
const Collector = require('../models/collector')
const { getHashedPassword } = require('../utils')


router.get('/', (req, res) => {
    res.render('register');
});


router.post('/', async (req, res) => {
    const { username, password, email, phone_number } = req.body;

    // Check if existing username
    if (await Collector.getByEmail(email)) {
        res.render('register', { 
                message: 'That email is already in use',
                messageClass: 'alert-danger'
            }
        )
        return
    }

    // Check if existing username
    if (await Collector.getByUsername(username)) {
        res.render('register', { 
                message: 'That username is already in use',
                messageClass: 'alert-danger'
            }
        )
        return
    }

    // Hash password and create the user.
    const hashedPassword = getHashedPassword(password)
    await Collector.create(username, hashedPassword, email, phone_number)

    res.render('login', {
        message: 'Registration complete. Please login to continue.',
        messageClass: 'alert-success'
    });
});

module.exports = router;