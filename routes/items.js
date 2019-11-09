const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Declare a Item variable and link it to controllers folder
const ItemController = require('../controllers/item');


// Item Page
router.get('/', ItemController.getIndex);

// My Items
router.get('/my-items', ItemController.getmyItems);




// Add Item
router.get('/add', ensureAuthenticated, ItemController.getAddItem);

// Post item Item
router.post('/', ensureAuthenticated, ItemController.AddItem);

// Edit Item
router.get('/edit/:id', ensureAuthenticated, ItemController.editItem);

// Item Page
router.get('/showOne/:id', ItemController.showOne);

// Edit Item
router.put('/:id', ensureAuthenticated, ItemController.putItem);

// Delete Item
router.delete('/:id', ensureAuthenticated, ItemController.deleteItem);


module.exports = router;
