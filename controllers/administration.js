const express = require('express');
const router = express.Router();

// Load Models
const User = require('../models/User');
const Item = require('../models/Item');

// Get Dashboard
router.getDashboard = (req, res) => {
   const loggedinUser = req.user;   
   
   User.find({})
      .then(users => {
         if (loggedinUser.userType === 2) {
            Item.find({})
               .then((items) => {

                  let countAdmins = 0;
                  let countSellers = 0;
                  let countShoppers = 0;
                  users.forEach(function (user) {
                     if (user.userType === 2) {
                        countAdmins++;
                     }
                     if (user.userType === 1) {
                        countSellers++;
                     }
                     if (user.userType === 0) {
                        countShoppers++;
                     }
                  });     

                  let countItems = 0;
                  let mostExpensive = 0;
                  let total = 0;
                  items.forEach(function (item) {
                     countItems++;
                     if (item.price > mostExpensive) {
                        mostExpensive = Math.round(item.price);
                     }
                     total += Math.round(item.price)
                  });               

                  // console.log(loggedinUser.userType)
                  res.render('dashboards/admin/index', { 
                     users,
                     items,
                     loggedinUser,
                     total,
                     mostExpensive,
                     countItems,
                     countAdmins,
                     countShoppers,
                     countSellers
                  })
               })
            
         } else if (loggedinUser.userType === 1) {
            res.render('dashboards/seller/index', { users, loggedinUser })
         } else {
            res.render('dashboards/basic/index', { users, loggedinUser })
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
         res.render('dashboards/admin/customers', { users: users, loggedinUser })
      })
}

// Get Admins
router.getAdminsAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('dashboards/admin/admins', { users: users, loggedinUser })
      })
}

// Get Sellers
router.getSellersAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('dashboards/admin/sellers', { users: users, loggedinUser })
      })
}

// Get Basic user
router.getBasicAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         res.render('dashboards/admin/basic', { users: users, loggedinUser })
      })
}

// Display User
router.getUserAsAdmin = (req, res) => {
   // Reading logged in user
   const loggedinUser = req.user
   //Find the user we want to change 
   User.findOne({ _id: req.params.id })
      .then(user => {
         res.render('dashboards/admin/edit', { user: user, loggedinUser })
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




/**
 * Admin Product Controlls
 */
// Get Customers
router.getProductsAsAdmin = (req, res) => {
   const loggedinUser = req.user
   User.find({})
      .then(users => {
         Item.find({})
            .then((items) => {
               res.render('dashboards/admin/products', {
                  users,
                  items,
                  loggedinUser
               })
            })

      })
}

// Get Customers
router.findOneProd = (req, res) => {
   const loggedinUser = req.user   
   Item.findOne({_id: req.params.id})
      .then(item => {
         res.render('dashboards/admin/findOneProd', { 
            item: item, 
            loggedinUser 
         })
      })

}


module.exports = router;