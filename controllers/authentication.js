const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load User model
const User = require('../models/User');

// Login Auth Controller
router.getLoginPage = (req, res) => {
   res.render('users/login')
}

router.userLogin = (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/dashboards',
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
                        req.flash('success_msg', 'You are now registered and can log in');
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
      successRedirect: '/dashboards',
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
      successRedirect: '/dashboards',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next);
}

// Password Recovery
router.getForgotPage = (req, res) => {
   res.render('users/forgot')
}

// Send recovery email
router.emailRecoveryLink = (req, res, next) => {
   async.waterfall([
      function (done) {
         crypto.randomBytes(20, function (err, buf) {
            let token = buf.toString('hex');
            done(err, token);
         });
      },
      function (token, done) {
         User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) {
               req.flash('error_msg', 'No account with that email exists');
               return res.redirect('/users/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; //1 hour

            user.save(function (err) {
               done(err, token, user);
            });
         });
      },
      function (token, user, done) {
         const passGmail = require('../config/keys').gmailPassword;
         let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
               user: 'iot.shop.company@gmail.com',
               pass: passGmail
            }
         });
         let mailOptions = {
            from: '"The Geeks of IoT" <iot.shop.company@gmail.com>',
            to: user.email,
            subject: 'Account Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
               'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
               'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
               'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
               'This Link will only be valid for 1 hour, use it now'
         };
         smtpTransport.sendMail(mailOptions, function (err) {
            req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
         });
      }
   ], function (err) {
      if (err) return next(err);
      res.redirect('/users/forgot');
   })
}

// Token validity expired
router.resetPassword = (req, res) => {
   User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
         $gt: Date.now()
      }
   }, (err, user) => {
      if (!user) {
         req.flash('error', 'Password reset token is invalid or has expired.');
         return res.redirect('/users/forgot');
      }
      res.render('./users/reset', {
         token: req.params.token
      });
   });
}

// Create and save new Password
router.createNewPassword = (req, res) => {
   async.waterfall([
      function (done) {
         User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
            if (!user) {
               req.flash('error', 'Password reset token is invalid or has expired.');
               return res.render('back');
            }
            if (req.body.password === req.body.confirmPassword && req.body.password != '' && req.body.password.length >= 6) {
               bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(req.body.password, salt, (err, hash) => {
                     if (err) throw err;
                     user.resetPasswordToken = undefined;
                     user.resetPasswordExpires = undefined;
                     user.password = hash;
                     user.save()
                        .then(user => {
                           req.flash('success_msg', 'Youre password is reset and can log in');
                           res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                  });
               });
            } else {
               if (!req.body.password || !req.body.confirmPassword) {
                  req.flash('error_msg', 'Please enter all fields');
               }
               if (req.body.password != req.body.confirmPassword) {
                  req.flash('error_msg', ' Passwords do not match');
               }
               if (req.body.password.length < 6) {
                  req.flash('error_msg', ' Password must be at least 6 characters');
               }
               return res.redirect('back');
            }
         });
      },
      function (user, done) {
         const passGmail = require('../config/keys').gmailPassword;
         let smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
               user: 'iot.shop.company@gmail.com',
               pass: passGmail
            }
         });
         let mailOptions = {
            to: user.email,
            from: 'learntocodeinfo@mail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
               'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
         };
         smtpTransport.sendMail(mailOptions, function (err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
         });
      }
   ], function (err) {
      res.redirect('/users/login');
   });
};


module.exports = router;