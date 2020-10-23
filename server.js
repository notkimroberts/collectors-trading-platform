var express = require('express');
var pg = require("pg");
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

var db_config = {
  	host            : 'ec2-54-152-40-168.compute-1.amazonaws.com',
 	user            : 'mscrtihrgsvnnl',
 	password        : 'a1dc14cac8176940787aaf245f861d8ba3ead3626d1e11c9879934d0a8171011',
 	database        : 'dddoluj8l08v7d'
};

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts'}));

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.render('layout', {layout : 'main'});
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
app.listen(port, function() {
    console.log("Listening on " + port);
});