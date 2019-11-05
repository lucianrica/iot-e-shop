const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Declare a Authentication variable and link it to controllers/authentication folder
const AuthenticationController = require('../controllers/authentication');


// Login Page
router.get('/login', AuthenticationController.getLoginPage);
router.post('/login', AuthenticationController.userLogin);

// Register Page
router.get('/register', AuthenticationController.getRegisterPage);
router.post('/register', AuthenticationController.userRegister);

// Google Authentication
router.get('/google', AuthenticationController.getGooglePage);
router.get('/google/callback', AuthenticationController.userGoogle);

// Facebook Authentication
router.get('/facebook', AuthenticationController.getFacebookPage);
router.get('/facebook/callback', AuthenticationController.userFacebook);

// Forgot Password Page
router.get('/forgot', AuthenticationController.getForgotPage);
router.get('/reset', AuthenticationController.getForgotPage);
router.get('/reset/:token', AuthenticationController.resetPassword);
router.post('/forgot', AuthenticationController.emailRecoveryLink);
router.post('/reset/:token', AuthenticationController.createNewPassword);


module.exports = router;
