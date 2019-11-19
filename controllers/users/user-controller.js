const User = require('../../models/User');
const Item = require('../../models/Item');

module.exports = {

   // Redirect users depending on user type
   index: async (req, res, next) => {
      const loggedinUser = req.user;
      if (loggedinUser.userType === 2) {
         res.status(200).redirect('users/admins')
      } else if (loggedinUser.userType === 1) {
         res.status(200).redirect('users/sellers')
      } else if (loggedinUser.userType === 0){
         res.status(200).redirect('users/shoppers')
      } else {
         res.status(200).redirect('/')
      }
   },

   // Find user
   getUser: async (req, res, next) => {
      const loggedinUser = req.user
      const user = await User.findOne({ _id: req.params.id })
      res.status(200).render('users/edit', { user, loggedinUser });
   },

   // edit user
   editUser: async (req, res, next) => {
      const user = await User.findOne({ _id: req.params.id });
      user.userType = req.body.userType;
      await user.save();
      req.flash('success_msg', 'User permission updated');
      res.status(200).redirect('back');
   },

   // update user
   updateUser: async (req, res, next) => {
      const { id } = req.params;
      const newUser = req.body;
      const result = await User.findByIdAndUpdate(id, newUser);
      req.flash('success_msg', 'User permission updated');
      res.status(200).redirect('back');
   },

   // delete user
   deleteUser: async (req, res, next) => {
      const loggedinUser = req.user      
      const { id } = req.params;
      await Item.deleteMany({ user: id });      
      await User.deleteOne({ _id: id });
      req.flash('success_msg', `User succesfully DELETED`);
      if (loggedinUser.userType === 2){
         res.status(200).redirect('/users/admins/all');
      } else {         
         res.status(200).redirect('/logout');
      }      
   },
   
   // Specific User Items
   getUserItems: async (req, res, next) => {
      const loggedinUser = req.user
      const { id } = req.params;
      const user = await User.findById(id).populate('items');
      const items = user.items
      res.status(200).render('items/my-items', { user, items, loggedinUser }); //(user.items);
   },

   // Create Items
   newUserItem: async (req, res, next) => {
      const { id } = req.params;
      const newItem = new Item(req.body);
      const user = await User.findById(id);
      newItem.seller = user._id;
      await newItem.save();
      user.items.push(newItem._id);
      await user.save();
      res.status(201).json(newItem)
   }

};











