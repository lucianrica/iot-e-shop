const passport = require('passport');

module.exports = {

   // Display login page
   index: (req, res, next) => {
      const loggedinUser = req.user;
      res.status(200).render('account/login', { loggedinUser });
   },

   // Authenticate user
   login: (req, res, next) => {
      passport.authenticate('local', {
         successRedirect: '/',
         failureRedirect: 'login',
         failureFlash: true
      })(req, res, next);
   } 
};