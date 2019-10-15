/** Quick Memo
 Express is a module that can be used to create more than one application.
 Puts this module into the variable "express".Once you have a reference to the module, you can use it to create application.Each module has its own API.
 */
const express = require('express'); // Create variable "express"
const mongoose = require('mongoose'); // Create variable "mongoose"
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Load User model
const User = require('./models/User');

// Passport Config
require('./config/passport')(passport);


// Initialise express
const app = express();


//  View-Engine and parsers
app.set('view engine', 'ejs');// Set the VIEW ENGINE and 
app.use('/assets', express.static('assets')); // Join static files
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: false }));//Parse URL-encoded bodies



//  Database connection
const db = require('./config/keys').MongoURI; //MongoDB config API key  
mongoose// Connect to MongoDb
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
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
    next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/oauth', require('./routes/oauth'));
app.use('/fb-auth', require('./routes/fb-auth'));






// TEMP CODE###################################
// Dashboard Page
app.get('/dashboard',  (req, res) =>
    User.find({})
        .then(users => {
            res.render('dashboard', {
                users: users
            })
        })
    );
// app.use('/dashboard', require('./routes/users'));

// ############################################








// Setup Server
const PORT = process.env.PORT || 5000; // Port settings
app.listen(PORT, (err) => { // Listen to PORT variable 
    if(err) throw err;
    console.log('1. Application started succesfully...')
    console.log(`2. Server connection ON, port: ${PORT}`);
})

