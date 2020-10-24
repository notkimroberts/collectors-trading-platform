const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const hbs = require('hbs');
const { Pool } = require('pg')
//https://node-postgres.com/features/connecting
const connectionString = 'postgres://mscrtihrgsvnnl:a1dc14cac8176940787aaf245f861d8ba3ead3626d1e11c9879934d0a8171011@ec2-54-152-40-168.compute-1.amazonaws.com:5432/dddoluj8l08v7d'

const pool = new Pool({
  connectionString: connectionString,
})

dotenv.config()

// import views
const indexRouter = require('./routes/index');
const collectibleRouter = require('./routes/collectible');
const collectorRouter = require('./routes/collector');
const rulesRouter = require('./routes/rules');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const quizRouter = require('./routes/quiz');
const quizresultRouter = require('./routes/quizresult');
const forgotpwRouter= require('./routes/forgotpw');
const authRouter = require('./auth');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('process.env.COOKIE_SECRET'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// mount routers
app.use('/', indexRouter);
app.use('/collectible', collectibleRouter); // TODO: Sample route, to be deleted.
app.use('/collector', collectorRouter); 
app.use('/rules', rulesRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/quiz', quizRouter);
app.use('/quizresult', quizresultRouter);
app.use('/forgotpw', forgotpwRouter);
app.use('/auth', authRouter);


hbs.registerPartials(path.join(__dirname, '/views/partials')) // register path to partial

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});



// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/*

// error handler
app.use(function(err, req, res, next) {
 
    res.status(err.status || 500);
    res.json ({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
  
    });
  });
*/
module.exports = app;