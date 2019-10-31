const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// const { forwardAuthenticated } = require('../config/auth');
// const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/User');



// Login Auth Controller
router.getLoginPage = /*forwardAuthenticated,*/ (req, res) => {
   res.render('users/login')
}

router.userLogin = (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
}



// Register Auth Controller
router.getRegisterPage = (req, res) => {
   res.render('users/register')
}

router.userRegister = (req, res) => {
   const { name, email, password, confirmPassword } = req.body;
   let errors = [];


   if (!name || !email || !password || !confirmPassword) {
      errors.push({ msg: 'Please enter all fields' });
   }

   if (password != confirmPassword) {
      errors.push({ msg: 'Passwords do not match' });
   }

   if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
   }

   if (errors.length > 0) {
      res.render('./users/register', {
         errors,
         name,
         email,
         password,
         confirmPassword
      });

   } else {
      User.findOne({ email: email }).then(user => {
         if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
               errors,
               name,
               email,
               password,
               confirmPassword
            });
         } else {
            const newUser = new User({
               name,
               email,
               password
            });

            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                     .save()
                     .then(user => {
                        req.flash(
                           'success_msg',
                           'You are now registered and can log in'
                        );
                        res.redirect('/users/login');
                     })
                     .catch(err => console.log(err));
               });
            });
         }
      });
   }
}



// Google Auth Controller
router.getGooglePage = (req, res, next) => {
   passport.authenticate('google', {
      scope: ['profile', 'email']
   })(req, res, next);
} 

router.userGoogle = (req, res, next) => {
   passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
}




// Facebook Auth Controller
router.getFacebookPage = (req, res, next) => {
   passport.authenticate('facebook', {
      scope: ['email']
   })(req, res, next);
} 

router.userFacebook = (req, res, next) => {
   passport.authenticate('facebook', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
}



// Logout
router.userLogout = (req, res) => {
   req.logout();
   req.flash('success_msg', 'You are logged out');
   res.redirect('/users/login');
}



module.exports = router;