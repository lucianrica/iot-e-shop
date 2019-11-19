const router = require('express-promise-router')();
const { ensureAuthenticated } = require('../../config/auth');
const UserController = require('../../controllers/users/user-controller');
const AdminController = require('../../controllers/users/admins/admin-controller');
const ShopperController = require('../../controllers/users/shoppers/shopper-controller');
const SellerController = require('../../controllers/users/sellers/seller-controller');

// User type
router.route('/')
   .get(UserController.index)

// Get, Create Items
router.route('/:id/items')
   .get(ensureAuthenticated, UserController.getUserItems)
   .post(ensureAuthenticated, UserController.newUserItem)

// Get, Replace, Update, Delete
router.route('/edit/:id')
   .get(ensureAuthenticated, UserController.getUser)
   .put(ensureAuthenticated, UserController.editUser)
   .patch(ensureAuthenticated, UserController.updateUser)
   .delete(ensureAuthenticated, UserController.deleteUser);

// Admins
router.route('/admins')
   .get(ensureAuthenticated, AdminController.index)
router.route('/admins/all')
   .get(ensureAuthenticated, AdminController.getUsers)
router.route('/admins/sellers')
   .get(ensureAuthenticated, AdminController.getSellers)
router.route('/admins/admins')
   .get(ensureAuthenticated, AdminController.getAdmins)
router.route('/admins/shoppers')
   .get(ensureAuthenticated, AdminController.getShoppers)

// Admin Products Controlls
router.get('/admins/products', ensureAuthenticated, AdminController.findItems);
router.get('/admins/findOneProd/:id', ensureAuthenticated, AdminController.findOneItem);

// Shopper
router.route('/shoppers')
   .get(ensureAuthenticated, ShopperController.index)

// User type
router.route('/sellers')
   .get(ensureAuthenticated, SellerController.index)


module.exports = router;


