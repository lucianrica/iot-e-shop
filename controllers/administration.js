const express = require('express');
const router = express.Router();

// Load User model
const User = require('../models/User');

// Get Dashboard
router.getDashboard = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         if (loggedinUser.userType === 2) {
            // console.log(loggedinUser.userType)
            res.render('./dashboards/admin/index', { users: users, loggedinUser })
         } else if (loggedinUser.userType === 1) {
            res.render('./dashboards/seller/index', { users: users, loggedinUser })
         } else {
            res.render('./dashboards/basic/index', { users: users, loggedinUser })
         }
      })
}


/**
 * Admin Controlls
 */
// Get Customers
router.getCustomersAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('./dashboards/admin/customers', { users: users, loggedinUser })
      })
}

// Get Admins
router.getAdminsAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('./dashboards/admin/admins', { users: users, loggedinUser })
      })
}

// Get Sellers
router.getSellersAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('./dashboards/admin/sellers', { users: users, loggedinUser })
      })
}

// Get Basic user
router.getBasicAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('./dashboards/admin/basic', { users: users, loggedinUser })
      })
}

// Display User
router.getUserAsAdmin = (req, res) => {
   // Reading logged in user
   const loggedinUser = req.user
   //Find the user we want to change 
   User.findOne({ _id: req.params.id })
      .then(user => {
         res.render('./dashboards/admin/edit', { user: user, loggedinUser })
      })
}

// Edit User
router.editUserAsAdmin = (req, res) => {
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
router.deleteUserAsAdmin = (req, res) => {
   User.findOne({
      _id: req.params.id
   }).then((user) => {
      req.flash('success_msg', `${user.name} succesfully DELETED`);
   })
   User.deleteOne({ _id: req.params.id })
      .then(() => {
         res.redirect('/dashboards/admin/customers');
      });
}


/**
 * Basic account controlls
 */

// Display User
router.getUserAsBasic = (req, res) => {
   // Reading logged in user
   const loggedinUser = req.user
   //Find the user we want to change 
   User.findOne({ _id: req.params.id })
      .then(user => {
         res.render('./dashboards/basic/edit', { user: user, loggedinUser })
      })
}


// Edit User
router.editUserAsBasic = (req, res) => {
   const loggedinUser = req.user
   User.findOne({ _id: req.params.id })
      .then(user => {

         const { name, email, } = req.body;

         if (!name) {
            req.flash('error_msg', 'Name field is empty');
            res.redirect('back');
            return;
         }
         
         if (name.length < 5) {
            req.flash('error_msg', 'Field must have than 4 letters');
            res.redirect('back');
            return;            
         }

         if (name.length > 4) {
            req.flash('success_msg', 'User succesfully updated');
            user.name = name || loggedinUser.name;            
         }

         user.save()
            .then(user => {               
               res.redirect('back');
            });      
      });
}


/**
 * Seller account controlls
 */

// Display User
router.getUserAsSeller = (req, res) => {
   // Reading logged in user
   const loggedinUser = req.user
   //Find the user we want to change 
   User.findOne({ _id: req.params.id })
      .then(user => {
         res.render('./dashboards/seller/edit', { user: user, loggedinUser })
      })
}

// // Edit User
router.editUserAsSeller = (req, res) => {
   const loggedinUser = req.user
   User.findOne({ _id: req.params.id })
      .then(user => {

         const { name, email, } = req.body;

         if (!name) {
            req.flash('error_msg', 'Name field is empty');
            res.redirect('back');
            return;
         }
         
         if (name.length < 5) {
            req.flash('error_msg', 'Field must have than 4 letters');
            res.redirect('back');
            return;            
         }

         if (name.length > 4) {
            req.flash('success_msg', 'User succesfully updated');
            user.name = name || loggedinUser.name;            
         }

         user.save()
            .then(user => {               
               res.redirect('back');
            });      
      });
}



// Delete Account
router.deleteUser = (req, res) => {
   User.findOne({
      _id: req.params.id
   }).then((user) => {
      req.flash('success_msg', `${user.name} succesfully DELETED`);
   })
   User.deleteOne({ _id: req.params.id })
      .then(() => {
         res.redirect('/');
      });
}

module.exports = router;