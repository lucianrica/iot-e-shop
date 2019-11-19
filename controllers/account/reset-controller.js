const async = require('async');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

module.exports = {

   // Token validity expired
   index: (req, res) => {
      const loggedinUser = req.user;
      User.findOne({
         resetPasswordToken: req.params.token,
         resetPasswordExpires: {
            $gt: Date.now()
         }
      }, (err, user) => {
         if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/login/forgot');
         }
         res.render('account/reset', {
            token: req.params.token,
            loggedinUser
         });
      });
   },

   // Create and save new Password
   newPassword: (req, res) => {
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
                              res.redirect('/login');
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
            const passGmail = require('../../config/keys').gmailPassword;
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
         res.redirect('/login');
      });
   }

};