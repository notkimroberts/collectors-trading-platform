const crypto = require('crypto');

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

module.exports = {
    // Functions
    getHashedPassword: (password) => {
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(password).digest('base64');
        return hash;
    },
    generateAuthToken: () => crypto.randomBytes(30).toString('hex'),
    requireAuth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.render('login', {
                message: 'Please login to continue',
                messageClass: 'alert-danger'
            });
        }
    },

    //session middleware configuration
    // Constants
    authTokens: {}

};

