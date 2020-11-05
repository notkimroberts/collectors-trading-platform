const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const dotenv = require('dotenv');
const express = require('express');
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');

const cors = require('cors');



// Express application
const app = express();


// Environment variables
dotenv.config()
const { NODE_ENV, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME } = process.env


// View engine (Handlebars) setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({ extname: '.hbs' }))
hbs.registerPartials(path.join(__dirname, '/views/partials'))


// App extenders
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('process.env.COOKIE_SECRET'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(logger('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  
  }));

// TODO: How does this work?
// Session middleware configuration
// app.use(session({
//     name: SESSION_NAME,
//     resave: false,
//     saveUninitialized: false,
//     secret: SESSION_SECRET,
//     cookie: {
//         maxAge: SESSION_LIFETIME,
//         sameSite: true,
//         secure: NODE_ENV
//     }
// }));


/* app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
}); */


// Mount routers
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


// Catch 404 and forward to error handler
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
    res.status(err.status || res.statusCode || 500);
    res.json (
        {
            message: err.message,
            error: req.app.get('env') === 'development' ? err : {}
        }
    );
    }
);

module.exports = app;