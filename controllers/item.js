const express = require('express');
const router = express.Router();

// Load Item model
const Item = require('../models/Item');

// Item Index page
router.getIndex = (req, res) => {
  Item.find({})
    .sort({ date: 'desc' })
    .then(items => {
      res.render('items/index', {
        items: items
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
  if (!req.body.smallIntro) {
    errors.push({ msg: 'Please add small description of the product, up to 150 words' });
  }
  if (!req.body.details) {
    errors.push({ msg: 'Please add detailed description of the product' });
  }
  if (!req.body.link) {
    errors.push({ msg: 'Please add a http link for photo' });
  }

  if (errors.length > 0) {
    res.render('items/add', {
      errors: errors,
      title: req.body.title,
      price: req.body.price,
      smallIntro: req.body.smallIntro,
      details: req.body.details,
      link: req.body.link
    })
  } else {
    const newUser = {
      title: req.body.title,
      price: req.body.price,
      smallIntro: req.body.smallIntro,
      details: req.body.details,
      link: req.body.link
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

// Get One Item
router.getOneItem = (req, res) => {

  Item.findOne({ _id: req.params.id })
    .then((item) => {
      res.render('items/showOne', {
        item: item
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
      if (!req.body.smallIntro) {
        errors.push({ msg: 'Please add small description of the product, up to 150 words' });
      }
      if (!req.body.details) {
        errors.push({ msg: 'Please add detailed description of the product' });
      }
      if (!req.body.link) {
        errors.push({ msg: 'Please add a http link for photo' });
      }

      if (errors.length > 0) {
        res.render('items/add', {
          errors: errors,
          title: req.body.title,
          price: req.body.price,
          smallIntro: req.body.smallIntro,
          details: req.body.details,
          link: req.body.link,
            
        })
      } else {
        item.title = req.body.title;
        item.price = req.body.price;
        item.smallIntro = req.body.smallIntro;
        item.details = req.body.details;
        item.link = req.body.link; 

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
  
  Item.deleteOne({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'product succesfully deleted');
      res.redirect('/items');
    })

}



module.exports = router;