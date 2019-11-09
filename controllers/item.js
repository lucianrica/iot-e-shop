const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Item model
const Item = require('../models/Item');

// Item Index page
router.getIndex = (req, res) => {
  // Get user to match with his products, although we display all we only display edit button just for his own products
  const user = req.user
  // Find all items
  Item.find({})
    .sort({ date: 'desc' })
    .then(items => {
      res.render('items/index', {
        items: items,
        user
      })
    })
}

// Item Index page
router.getmyItems = (req, res) => {
  // Get user to match with his products, although we display all we only display edit button just for his own products
  const user = req.user
  // Find all items
  Item.find({})
    .sort({ date: 'desc' })
    .then(items => {
      res.render('items/my-items', {
        items: items,
        user
      })
    })
}

// Get Item Add
router.getAddItem = (req, res) => {
  res.render('items/add')
}


// Post Item
router.AddItem = (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ msg: 'Please add a title' });
  }
  if (!req.body.price) {
    errors.push({ msg: 'Please add a price' });
  }
  if (!req.body.salesPitch) {
    errors.push({ msg: 'Please add a sales pitch, max 150 letters' });
  }
  if (!req.body.details) {
    errors.push({ msg: 'Please add detailed description of the product' });
  }
  if (!req.body.imgOne) {
    errors.push({ msg: 'You need atleast one link for main photo' });
  }

  if (errors.length > 0) {
    res.render('items/add', {
      errors: errors,
      title: req.body.title,
      price: req.body.price,
      salesPitch: req.body.salesPitch,
      details: req.body.details,
      imgOne: req.body.imgOne,
      imgTwo: req.body.imgTwo,
      imgThree: req.body.imgThree,
      imgFour: req.body.imgFour
    })
  } else {
    const newUser = {
      title: req.body.title,
      price: req.body.price,
      salesPitch: req.body.salesPitch,
      details: req.body.details,
      img: req.body.img,
      user: req.user.id,
      photos: [
        req.body.imgOne,
        req.body.imgTwo,
        req.body.imgThree,
        req.body.imgFour
      ]
    }
    new Item(newUser)
      .save()
      .then(item => {
        res.redirect('items');
      })
  }
}

// Get edit Item
router.editItem = (req, res) => {
  Item.findOne({ _id: req.params.id })
    .then((item) => {
      res.render('items/edit', {
        item: item
      })
    })
}

// Show One Item
router.showOne = (req, res, next) => {

  Item.find({})
    .then(items => {
      Item.findOne({_id: req.params.id})
        .then((item) => {          
          res.render('items/showOne', {
            item: item,
            items            
          })
        })
        
    })
  
}


// edit Item
router.putItem = (req, res) => {

  Item.findOne({ _id: req.params.id })
    .then((item) => {

      let errors = [];

      if (!req.body.title) {
        errors.push({ msg: 'Please add a title' });
      }
      if (!req.body.price) {
        errors.push({ msg: 'Please add a price' });
      }
      if (!req.body.salesPitch) {
        errors.push({ msg: 'Please add a sales pitch, max 150 letters' });
      }
      if (!req.body.details) {
        errors.push({ msg: 'Please add detailed description of the product' });
      }
      if (!req.body.imgOne) {
        errors.push({ msg: 'You need atleast one link for main photo' });
      }

      if (errors.length > 0) {
        res.render('items/add', {
          errors: errors,
          title: req.body.title,
          price: req.body.price,
          salesPitch: req.body.salesPitch,
          details: req.body.details,
          imgOne: req.body.imgOne,
          imgTwo: req.body.imgTwo,
          imgThree: req.body.imgThree,
          imgFour: req.body.imgFour,
        })
      } else {
        item.title = req.body.title;
        item.price = req.body.price;
        item.salesPitch = req.body.salesPitch;
        item.details = req.body.details;
        item.photos = [
          req.body.imgOne,
          req.body.imgTwo,
          req.body.imgThree,
          req.body.imgFour
        ]

        item.save()
          .then(item => {
            req.flash('success_msg', 'product succesfully saved');
            res.redirect('/items');
          })
      }
    })
}


// Delete Item
router.deleteItem = (req, res) => {
  Item.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'product succesfully deleted');
      res.redirect('/items');
    })

}



module.exports = router;