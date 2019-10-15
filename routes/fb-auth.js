const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/facebook', passport.authenticate('facebook', {
   scope: ['email']
}));

router.get('/facebook/callback',
   passport.authenticate('facebook', { failureRedirect: '/users/login' }), (req, res) => {
      // Successful authentication, redirect dashboard.
      res.redirect('/dashboard');
   });

module.exports = router;