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
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');

dotenv.config()

// import views
const addCollectibleRouter = require('./routes/addCollectible');
const collectibleRouter = require('./routes/collectible');
const collectorRouter = require('./routes/collector');
const editCollectibleRouter = require('./routes/editCollectible');
const forgotPasswordRouter= require('./routes/forgotPassword');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const quizRouter = require('./routes/quiz');
const quizResultRouter = require('./routes/quizResult');
const registerRouter = require('./routes/register');
const rulesRouter = require('./routes/rules');
const tradeRouter = require('./routes/trade');
const authRouter = require('./auth');

var authMiddleware = require('./auth/middleware')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({ extname: '.hbs' }))
hbs.registerPartials(path.join(__dirname, '/views/partials'))

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
app.use('/add-collectible', addCollectibleRouter);
app.use('/collectible', collectibleRouter);
app.use('/collector', collectorRouter); 
app.use('/edit-collectible', editCollectibleRouter); 
app.use('/forgot-password', forgotPasswordRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/quiz', quizRouter);
app.use('/quiz-result', quizResultRouter);
app.use('/trade', tradeRouter);
app.use('/register', registerRouter);
app.use('/rules', rulesRouter);
app.use('/logout', logoutRouter);
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