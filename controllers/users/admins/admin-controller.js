const User = require('../../../models/User');
const Item = require('../../../models/Item');

module.exports = {

   // Get dashboard
   index: async (req, res, next) => {
      const loggedinUser = req.user;
      const users = await User.find({});
      const items = await Item.find({});

      let countAdmins = 0, countSellers = 0, countShoppers = 0;
      await users.forEach(user => {
         if (user.userType === 2) { countAdmins++; }
         if (user.userType === 1) { countSellers++; }
         if (user.userType === 0) { countShoppers++; }
      });

      let countItems = 0, mostExpensive = 0, total = 0;
      await items.forEach(item => {
         countItems++;
         if (item.price > mostExpensive) {
            mostExpensive = Math.round(item.price);
         }
         total += item.quantity * Math.round(item.price)
      });

      res.status(200).render('users/admins/dashboard', {
         loggedinUser, users, items, total, mostExpensive,
         countItems, countAdmins, countShoppers, countSellers
      })
   },

   // All users
   getUsers: async (req, res, next) => {
      const loggedinUser = req.user;
      const users = await User.find({});
      if (loggedinUser != undefined) {
         res.status(200).render('users/admins/all', { users, loggedinUser })
      } else {
         res.status(200).redirect('/');
      }
   },

   // Sellers
   getSellers: async (req, res, next) => {
      const loggedinUser = req.user;
      const users = await User.find({});
      res.status(200).render('users/admins/sellers', { users, loggedinUser })

   },

   // Admins
   getAdmins: async (req, res, next) => {
      const loggedinUser = req.user;
      const users = await User.find({});
      res.status(200).render('users/admins/admins', { users, loggedinUser })

   },

   // Shoppers
   getShoppers: async (req, res, next) => {
      const loggedinUser = req.user;
      const users = await User.find({});
      res.status(200).render('users/admins/shoppers', { users, loggedinUser })

   },

   findItems: async (req, res, next) => {
      const loggedinUser = req.user
      const users = await User.find({});
      const items = await Item.find({});
      res.status(200).render('users/admins/products', { users, items, loggedinUser })
   },

   findOneItem: async (req, res, next) => {
      const loggedinUser = req.user   
      const item = await Item.findOne({_id: req.params.id})         
      res.render('users/admins/findOneProd', { item, loggedinUser })     
   }

};