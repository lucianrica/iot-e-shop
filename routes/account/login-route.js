const router = require('express-promise-router')();
const LoginController = require('../../controllers/account/login-controller');
const ForgotController = require('../../controllers/account/forgot-controller');
const ResetController = require('../../controllers/account/reset-controller');
const GoogleController = require('../../controllers/account/google-controller');
const FacebookController = require('../../controllers/account/facebook-controller');

// Login
router.route('/')
   .get(LoginController.index)
   .post(LoginController.login)

// Google
router.route('/google')
   .get(GoogleController.index)
router.route('/google/callback')
   .get(GoogleController.callback)

// Facebook
router.route('/facebook')
   .get(FacebookController.index)
router.route('/facebook/callback')
   .get(FacebookController.callback)

// Forgot Password
router.route('/forgot')
   .get(ForgotController.index)
   .post(ForgotController.sendEmail)

// Reset Password
router.route('/reset/:token')
   .get(ResetController.index)
   .post(ResetController.newPassword)

module.exports = router;