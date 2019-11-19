const router = require('express-promise-router')();
const RegisterController = require('../../controllers/account/register-controller');

//  Register
router.route('/')
   .get(RegisterController.index)
   .post(RegisterController.newUser);

module.exports = router;