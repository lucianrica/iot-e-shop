const router = require('express-promise-router')();
const HomeController = require('../../controllers/shop/home-controller');

router.route('/')
   .get(HomeController.index)

module.exports = router;