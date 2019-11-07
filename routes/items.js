const express = require('express');
const router = express.Router();

// Declare a Item variable and link it to controllers folder
const ItemController = require('../controllers/item');


// Item Page
router.get('/', ItemController.getIndex);
// Item Page
router.get('/showOne/:id', ItemController.getOneItem);



// Add Item
router.get('/add', ItemController.getAddItem);

// Post item Item
router.post('/', ItemController.AddItem);

// Edit Item
router.get('/edit/:id', ItemController.editItem);


// Edit Item
router.put('/:id', ItemController.putItem);

// Delete Item
router.delete('/:id', ItemController.deleteItem);


module.exports = router;
