const express = require('express');
const router = express.Router();
const collector = require('../models/collector')

router.get('/', (req, res) => {
    res.render('register', { title: "Register" });
});

router.post('/', function(req, res){
    console.log(req.body)
    collector.createUser((req.body.is_admin, req.body.username, req.body.password, req.body.fullname,
         req.body.contact_email, req.body.phone_number))
    });

//register -> collector table, create folder called models
module.exports = router;