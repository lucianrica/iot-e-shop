const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Declare a Administration variable and link it to controllers/administration folder
const AdministrationController = require('../controllers/administration');

// // Dashboard Page
router.get('/', ensureAuthenticated, 
   AdministrationController.getDashboard);
// router.get('/admin', ensureAuthenticated, 
//    AdministrationController.getDashboard);


/**
 * Admin Controlls
 */
// Customers Page
router.get('/admin/customers', ensureAuthenticated, 
   AdministrationController.getCustomersAsAdmin);

// Admins Filter
router.get('/admin/admins', ensureAuthenticated, 
   AdministrationController.getAdminsAsAdmin);

// Sellers Filter
router.get('/admin/sellers', ensureAuthenticated, 
   AdministrationController.getSellersAsAdmin);

// Basic Users Filter
router.get('/admin/basic', ensureAuthenticated, 
   AdministrationController.getBasicAsAdmin);

// Get user
router.get('/admin/edit/:id', ensureAuthenticated, 
   AdministrationController.getUserAsAdmin);

// Edit user
router.put('/admin/:id', ensureAuthenticated, 
   AdministrationController.editUserAsAdmin);

// Delete user
router.delete('/admin/:id', ensureAuthenticated, 
   AdministrationController.deleteUserAsAdmin);


// /**
//  * Basic User Controlls
//  */

// // Get user
router.get('/basic/edit/:id', ensureAuthenticated, 
   AdministrationController.getUserAsBasic);

// Edit user
router.put('/basic/:id', ensureAuthenticated, 
   AdministrationController.editUserAsBasic);

// Delete user
router.delete('/basic/:id', ensureAuthenticated, 
   AdministrationController.deleteUser);


// /**
//  * Seller User Controlls
//  */

// // Get user
router.get('/seller/edit/:id', ensureAuthenticated, 
   AdministrationController.getUserAsSeller);

// Edit user
router.put('/seller/:id', ensureAuthenticated, 
   AdministrationController.editUserAsSeller);

// Delete user
router.delete('/seller/:id', ensureAuthenticated, 
   AdministrationController.deleteUser);




module.exports = router;



