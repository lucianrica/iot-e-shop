const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {



   /**
   * Local Strategy
   */
   passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
         // Match user
         User.findOne({
            email: email
         }).then(user => {
            if (!user) {
               return done(null, false, { message: 'That email is not registered' });
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
               if (err) throw err;
               if (isMatch) {
                  return done(null, user);
               } else {
                  return done(null, false, { message: 'Password incorrect' });
               }
            });
         });
      })
   );
   /**
   * Local Strategy END#######################################
   */



   /**
   * Google Strategy
   */
   passport.use(
      new GoogleStrategy({
         clientID: keys.googleClientID,
         clientSecret: keys.googleClientSecret,
         callbackURL: '/oauth/google/callback',
         proxy: true
      }, (accessToken, refreshToken, profile, done) => {
         // console.log(accessToken);
         // console.log(profile);
         // const name = profile._json.name;
         // const name = profile._json.email;
         // console.log(name)

         const newUser = {
            name: profile._json.name,
            email: profile._json.email,
            password: false
         }

         //Check for existing user
         User.findOne({
            email: profile._json.email
         }).then(user => {
            if(user){
               //Return User
               done(null, user);
            }else{
               //Create User
               new User(newUser)
                  .save()
                  .then(user => done(null, user));
            }
         })
      })
   )
   /**
    * Google Strategy END#######################################
    */



   passport.use(
      new FacebookStrategy({
         clientID: keys.facebookClientID,
         clientSecret: keys.facebookClientSecret,
         callbackURL: '/fb-auth/facebook/callback',
         profileFields: ['email', 'name'],
         proxy: true
      }, (accessToken, refreshToken, profile, done) => {
         // console.log(accessToken);
         // console.log('profile', profile);
         // const name = profile._json.name;
         // const name = profile._json.email;
         // console.log(name)

         const newUser = {
            name: profile._json.name,
            email: profile.emails[0].value,
            password: false
         }

         // Check for existing user
         User.findOne({
            email: profile.emails[0].value
         }).then(user => {
            if (user) {
               //Return User
               done(null, user);
            } else {
               //Create User
               new User(newUser)
                  .save()
                  .then(user => done(null, user));
            }
         })
      })
   )

   passport.serializeUser(function (user, done) {
      done(null, user.id);
   });

   passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
         done(err, user);
      });
   });
};

