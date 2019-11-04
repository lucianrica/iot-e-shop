const express = require('express');
const router = express.Router();

// Load User model
const User = require('../models/User');

// Get Dashboard
router.getDashboard = (req, res) => {
   User.find({})
      .then(users => {
         res.render('./dashboards/admin', { users: users })
      })
}

// Display User
router.getUser = (req, res) => {
   User.findOne({ _id: req.params.id })
      .then(user => {
         res.render('./dashboards/edit', { user: user })
      })
}

// Edit User
router.editUser = (req, res) => {   
   User.findOne({ _id: req.params.id })
      .then(user => {
         user.userType = req.body.userType;
         // console.log(user.userType)  
         user.save()
            .then(user => {
               req.flash('success_msg', 'User permission updated');
               res.redirect('back');              
            });
      });
}

// Delete User
router.deleteUser = (req, res) => {
   User.findOne({
      _id: req.params.id
   }).then((user) => {
      req.flash('success_msg', `User ${user.name} succesfully DELETED`);
   })
   User.deleteOne({_id: req.params.id})   
      .then(() => {
         res.redirect('/dashboards');
      });
}

module.exports = router;