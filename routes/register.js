const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('register', { title: "Register" });
});

// router.post('/', function(req, res){
//     console.log(req.body)
//     var pg = req.app.get('pg');
//     var sql = "INSERT INTO collector(is_admin, username, password, fullname, address, city, state, country, zipcode,contact_email, phone_number) VALUES (?,?,?,?)";
//     var inserts = [req.body.is_admin, req.body.username, req.body.password, req.body.fullname, req.body.address,
//         req.body.city, req.body.state, req.body.country, req.body.contact_email, req.body.phone_number]; 
//     sql = pg.pool.query(sql,inserts,function(error, results, fields){
//         if(error){
//             console.log(JSON.stringify(error))
//             res.write(JSON.stringify(error));
//             res.end();
//         }else{
//             res.render('register', { title: "Register" });
//        }
//     });
//     });

module.exports = router;