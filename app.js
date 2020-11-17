const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const logger = require('morgan');
const dotenv = require('dotenv')
const hbs = require('hbs')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');

dotenv.config()

// import views
const addCollectibleRouter = require('./routes/addcollectible');
const collectibleRouter = require('./routes/collectible');
const collectorRouter = require('./routes/collector');
const collectorListRouter = require('./routes/collectorpagelist');
const deleteCollectibleRouter = require('./routes/deletecollectible');
const editcollectibleRouter = require('./routes/editcollectible');
const forgotPasswordRouter= require('./routes/forgotPassword');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const profileListRouter = require('./routes/profilelist');
const quizRouter = require('./routes/quiz');
const quizResultRouter = require('./routes/quizresult');
const registerRouter = require('./routes/register');
const rulesRouter = require('./routes/rules');
const tradeRouter = require('./routes/trade');
const tradeImagesRouter = require('./routes/tradeimages');
const authRouter = require('./auth');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({ extname: '.hbs' }))
hbs.registerPartials(path.join(__dirname, '/views/partials'))

// App extenders
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('process.env.COOKIE_SECRET'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((req, res, next)=>{
    if (req.signedCookies.user_id) {
        res.locals.isAuthenticated = true;
    }
    next();
});

// mount routers
app.use('/', indexRouter);
app.use('/add-collectible', addCollectibleRouter);
app.use('/collectible', collectibleRouter);
app.use('/collector', collectorRouter); 
app.use('/collector-list', collectorListRouter); 
app.use('/delete-collectible', deleteCollectibleRouter);
app.use('/edit-collectible', editcollectibleRouter); 
app.use('/forgot-password', forgotPasswordRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/profile-list', profileListRouter);
app.use('/quiz', quizRouter);
app.use('/quiz-result', quizResultRouter);
app.use('/trade', tradeRouter);
app.use('/trade-images', tradeImagesRouter);
app.use('/register', registerRouter);
app.use('/rules', rulesRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);

hbs.registerPartials(path.join(__dirname, '/views/partials')) // register path to partial

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || res.statusCode || 500);
    res.json ({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  });

module.exports = app;