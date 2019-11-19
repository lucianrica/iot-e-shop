const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../../models/User');

module.exports = {

   // Get forgot page
   index: (req, res) => {
      const loggedinUser = req.user; 
      res.render('account/forgot' , { loggedinUser})
   },

   // Send recovery email
   sendEmail: (req, res, next) => {
      const loggedinUser = req.user; 
      async.waterfall([
         function (done) {
            crypto.randomBytes(10, function (err, buf) {
               let token = buf.toString('hex');
               done(err, token);
            });
         },
         function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
               if (!user) {
                  req.flash('error_msg', 'No account with that email exists');
                  return res.redirect('/login/forgot');
               }

               user.resetPasswordToken = token;
               user.resetPasswordExpires = Date.now() + 3600000; //1 hour

               user.save(function (err) {
                  done(err, token, user);
               });
            });
         },
         function (token, user, done) {
            const passGmail = require('../../config/keys').gmailPassword;
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
                  'http://' + req.headers.host + '/login/reset/' + token + '\n\n' +
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
         res.redirect('/login/forgot');
      })
   }

};