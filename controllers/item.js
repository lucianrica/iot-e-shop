const express = require('express');
const router = express.Router();

// Load Item model
const Item = require('../models/Item');

// Get Item
router.getItem = (req, res) => {
   res.send(' items page')
   // const loggedinUser = req.user
   // User.find({})
   //    .then(users => {
   //       if (loggedinUser.userType === 2) {
   //          // console.log(loggedinUser.userType)
   //          res.render('./dashboards/admin/index', { users: users, loggedinUser })
   //       } else if (loggedinUser.userType === 1) {
   //          res.render('./dashboards/seller/index', { users: users, loggedinUser })
   //       } else {
   //          res.render('./dashboards/basic/index', { users: users, loggedinUser })
   //       }
   //    })
  
  
}

// // Add Item
// router.AddItem = (req, res) => {
  
  
  
// }

// // edit Item
// router.editItem = (req, res) => {
  
  
  
// }

// // Get Item
// router.deleteItem = (req, res) => {
  
  
  
// }



module.exports = router;