const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Declare a Administration variable and link it to controllers/administration folder
const AdministrationController = require('../controllers/administration');

// Dashboard Page
router.get('/', ensureAuthenticated, 
   AdministrationController.getDashboard);

// Get user
router.get('/edit/:id', ensureAuthenticated, 
   AdministrationController.getUser);

// Edit user
router.put('/:id', ensureAuthenticated, 
   AdministrationController.editUser);

// Delete user
router.delete('/:id', ensureAuthenticated, 
   AdministrationController.deleteUser);

module.exports = router;



