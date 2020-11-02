const { authTokens } = require('./utils')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const hbs = require('hbs');
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const path = require('path');

// import views
const indexRouter = require('./routes/index');
const collectibleRouter = require('./routes/collectible');
const rulesRouter = require('./routes/rules');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const quizRouter = require('./routes/quiz');
const quizresultRouter = require('./routes/quizresult');
const forgotpwRouter = require('./routes/forgotpw');
// Express application
const app = express();


// Environment variables
dotenv.config()

// View engine (Handlebars) setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'))

// App extenders
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(logger('dev'));


//session middleware configuration
const{
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'hellosecret', //dummy string to sign cookie
    SESS_LIFETIME = 2
} = process.env

const IN_PROD = NODE_ENV === 'production';

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME, //two hours
        sameSite: true,
        secure: IN_PROD //production env or dev 
    }
}));

app.get('/', (req, res) => {
    const {userId} = req.session;
    console.log(userId);
    res.render('index');
});


app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});


// Mount routers
const addCollectibleRouter = require('./routes/addCollectible');
const collectibleRouter = require('./routes/collectible');
const collectorRouter = require('./routes/collector');
const forgotPasswordRouter= require('./routes/forgotPassword');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const quizRouter = require('./routes/quiz');
const tradeRouter = require('./routes/trade');
const quizResultRouter = require('./routes/quizResult');
const registerRouter = require('./routes/register');
const rulesRouter = require('./routes/rules');
const editcollectibleRouter = require('./routes/editcollectible');

app.use('/', indexRouter);
app.use('/add-collectible', addCollectibleRouter);
app.use('/collectible', collectibleRouter);
app.use('/collector', collectorRouter); 
app.use('/forgot-password', forgotPasswordRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/quiz', quizRouter);
app.use('/quizresult', quizresultRouter);
app.use('/forgotpw', forgotpwRouter);
app.use('/quiz-result', quizResultRouter);
app.use('/trade', tradeRouter);
app.use('/register', registerRouter);
app.use('/rules', rulesRouter);
app.use('/logout', logoutRouter);

app.use('/editcollectible', editcollectibleRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});


// Error handler
app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    }
);


// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json (
        {
            message: err.message,
            error: req.app.get('env') === 'development' ? err : {}
  
        }
    );
    }
);

module.exports = app;
