const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load User model
const User = require('../models/User');

router.get('/', (req, res) => {
   res.render('index')
});


module.exports = router;