const express = require('express');
const router = express.Router();

//https://stackoverflow.com/questions/44883228/how-to-get-the-express-session-variable-in-all-the-handlebars-pages-right-now-i
// router.get('/', function(req, res){
//     res.render('profile', { username: req.body.user.username });
//   });
router.get('/',function (req, res, next) {

    // call to the table
    db.getUser(Collector).then((username) => {
       res.render("profile", {user: req.body.user.username});
    }).catch(next)
 });

module.exports = router;

