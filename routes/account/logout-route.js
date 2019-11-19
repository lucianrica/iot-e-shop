const router = require('express-promise-router')();
const LogoutController = require('../../controllers/account/logout-controller');

//  Register
router.route('/')
   .get(LogoutController.index)

module.exports = router;





