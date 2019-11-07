/** 
 * Name: eShop 
 * Authors: Lucian Nechita, Daniel Costel neagu, Marius Pal, Carlos Barbier
 * Date: 28/10/2019
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const { ensureAuthenticated } = require('./config/auth');


// Passport Config
require('./config/passport')(passport);
// Initialise express
const app = express();


// Set the View-Engine
app.set('view engine', 'ejs');
// Join Static Files
app.use('/public', express.static(path.join(__dirname, 'public')));
//Used to parse JSON bodies
app.use(express.json());
//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));
// Method override
app.use(methodOverride('_method'));


//  Database Config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('3. MongoDB connection established\n'))
    .catch(err => console.err(err));


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());
// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.item = req.item || null;
    next();
});


// Routes

app.use('/', require('./routes/index'));
app.use('/items', require('./routes/items'));
app.use('/users', require('./routes/users'));
app.use('/dashboards', require('./routes/dashboards'));


// Global Logout
app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


// Setup Server
const PORT = process.env.PORT || 5000; // Port settings
app.listen(PORT, (err) => { // Listen to PORT variable 
    if (err) throw err;
    console.log('1. Application started succesfully...')
    console.log(`2. Server connection ON, port: ${PORT}`);
})

