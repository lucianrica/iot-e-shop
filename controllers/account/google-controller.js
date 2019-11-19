const passport = require('passport');

module.exports = {

   // Google Req
   index: (req, res, next) => {
      passport.authenticate('google', {
         scope: ['profile', 'email']
      })(req, res, next);
   },

   // Google Res
   callback: (req, res, next) => {
      passport.authenticate('google', {
         successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
      })(req, res, next);
   }
     
};