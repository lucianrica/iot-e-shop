const express = require('express');
const router = express.Router();

// Declare a Item variable and link it to controllers folder
const ItemController = require('../controllers/authentication');


// // Item Page
// router.get('/items', ItemController.getItem);



// // Add Item
// router.post('/items', ItemController.AddItem);
// // Edit Item
// router.put('/admin/:id', ensureAuthenticated, ItemController.editItem);
// // Delete Item
// router.delete('/admin/:id', ensureAuthenticated, ItemController.deleteItem);


module.exports = router;
