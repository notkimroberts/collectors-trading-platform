const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv')
const hbs = require('hbs')
const favicon = require('serve-favicon');
const cors = require('cors');

dotenv.config()

// import views
const indexRouter = require('./routes/index');
const collectibleRouter = require('./routes/collectible');
const collectorRouter = require('./routes/collector');
const rulesRouter = require('./routes/rules');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const quizRouter = require('./routes/quiz');
const quizresultRouter = require('./routes/quizresult');
const forgotpwRouter= require('./routes/forgotpw');
const authRouter = require('./auth');

var authMiddleware = require('./auth/middleware')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('process.env.COOKIE_SECRET'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  
  }));

// mount routers
app.use('/', indexRouter);
app.use('/collectible', collectibleRouter); // TODO: Sample route, to be deleted.
app.use('/collector', collectorRouter); 
app.use('/rules', rulesRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
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
    res.status(err.status || res.statusCode || 500);
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