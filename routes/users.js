const express = require('express');
const router = express.Router();

// Declare a Users variable and link it to controllers/users folder
const UsersController = require('../controllers/users');



// Login Page
router.get('/login', UsersController.getLoginPage);
router.post('/login', UsersController.userLogin);



// Register Page
router.get('/register', UsersController.getRegisterPage);
router.post('/register', UsersController.userRegister);



// Google Authentication
router.get('/google', UsersController.getGooglePage);
router.get('/google/callback', UsersController.userGoogle);



// Facebook Authentication
router.get('/facebook', UsersController.getFacebookPage);
router.get('/facebook/callback', UsersController.userFacebook);



// Forgot Password Page
router.get('/forgot', UsersController.getForgotPage);
router.get('/reset/:token', UsersController.resetPassword);
router.post('/forgot', UsersController.emailRecoveryLink);
router.post('/reset/:token', UsersController.createNewPassword);




// Logout
router.get('/logout', UsersController.userLogout);


module.exports = router;