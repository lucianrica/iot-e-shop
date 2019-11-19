const router = require('express-promise-router')();
const { ensureAuthenticated } = require('../../config/auth');
const ItemController = require('../../controllers/items/item-controller');

// Item Page
router.route('/')
   .get(ItemController.index)
   .post(ensureAuthenticated, ItemController.newItem);

 // Get, Replace, Update, Delete Item
router.route('/:id')
   .get(ItemController.getItem)
   .put(ItemController.rateItem)
   .patch(ensureAuthenticated, ItemController.updateItem)
   .delete(ensureAuthenticated, ItemController.deleteItem)

router.route('/edit/:id')
   .get(ensureAuthenticated, ItemController.getEdit)
   .patch(ensureAuthenticated, ItemController.updateItem)
   
module.exports = router;
