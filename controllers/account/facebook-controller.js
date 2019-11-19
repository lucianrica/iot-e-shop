const passport = require('passport');

module.exports = {

   // Facebook Req
   index: (req, res, next) => {
      passport.authenticate('facebook', {
         scope: ['email']
      })(req, res, next);
   },

   // Facebook Res
   callback: (req, res, next) => {
      passport.authenticate('facebook', {
         successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
      })(req, res, next);
   }
   
};