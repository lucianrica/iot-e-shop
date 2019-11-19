const Item = require('../../models/Item');
const User = require('../../models/User');

module.exports = {

  // Add Item Form
  index: async (req, res, next) => {
    const loggedinUser = req.user
    const user = req.user
    res.status(200).render('items/add', { user, loggedinUser });
  },

  // Create New Item
  newItem: async (req, res, next) => {
    const loggedinUser = req.user
    const { title, price, salesPitch, details, imgOne, imgTwo, imgThree, imgFour, quantity } = req.body;
    let errors = [];

    if (!title) {
      errors.push({ msg: 'Please add a title' });
    }
    if (!price) {
      errors.push({ msg: 'Please add a price' });
    }
    if (!salesPitch) {
      errors.push({ msg: 'Please add a sales pitch, max 150 letters' });
    }
    if (!details) {
      errors.push({ msg: 'Please add detailed description of the product' });
    }
    if (!imgOne) {
      errors.push({ msg: 'You need atleast one link for main photo' });
    }
    if (!quantity) {
      errors.push({ msg: 'Please enter quantity' });
    }

    if (errors.length > 0) {
      return res.render('items/add', {
        loggedinUser, errors, title, price, salesPitch, details, imgOne, imgTwo, imgThree,
        imgFour, quantity
      })
    }

    const user = req.user;
    const views = 0;
    const rating = 0;

    
    const newItem = {
      title, price, salesPitch, details, quantity,
      photos: [imgOne, imgTwo, imgThree, imgFour]
    }
    const item = new Item(newItem);
    item.user = user._id;
    await item.save();
    user.items.push(item._id);
    await user.save();
    res.status(200).redirect(`/users/${user._id}/items`);
  },

  // get item by id
  getItem: async (req, res, next) => {
    const loggedinUser = req.user;
    const items = await Item.find({});
    const item = await Item.findOne({ _id: req.params.id });
    let temp = item.views;
    item.views = (temp + 1);
    await item.save();
    res.status(200).render('items/get-item', { items, item, loggedinUser });
  },

  // rate item
  rateItem: async (req, res, next) => {
    const loggedinUser = req.user;
    const items = await Item.find({});
    const item = await Item.findOne({ _id: req.params.id });
    let temp = item.rating;
    item.rating = (temp + 1);
    await item.save();
    res.status(200).render('items/get-item', { items, item, loggedinUser });
  },

  // edit item page
  getEdit: async (req, res, next) => { 
    const loggedinUser = req.user; 
    const user = req.user;  
    const item = await Item.findOne({ _id: req.params.id });
    res.status(200).render('items/edit', { user, item, loggedinUser })
  },

  // Update item 
  updateItem: async (req, res, next) => {
    const user = req.user;    
    const { id } = req.params;

    // const { id } = item._id; 
    const { title, price, salesPitch, details, imgOne, imgTwo, imgThree, imgFour, quantity } = req.body;
          
    const newItem = {
      title, price, salesPitch, details, quantity,
      photos: [imgOne, imgTwo, imgThree, imgFour]
    }
    await Item.findByIdAndUpdate(id, newItem);
    req.flash('success_msg', 'product succesfully saved');
    res.status(200).redirect(`/users/${user.id}/items`);

  },

  // delete item
  deleteItem: async (req, res, next) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      req.flash('success_msg', 'item doesn\'t exist');
      return res.status(404).redirect(`/users/${user.id}/items`);
    }
    const userId = item.user;
    const user = await User.findById(userId);
    await item.remove();
    user.items.pull(item);
    await user.save();
    res.status(200).redirect(`/users/${user.id}/items`);

  }
};