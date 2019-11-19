const Item = require('../../models/Item');

module.exports = {

   // Get items to display on home page sorted by different atributes
   index: async (req, res, next) => {
      const loggedinUser = req.user;
      const newItems = await Item.find({}).sort({ createdAt: 'desc' });
      const allItems = await Item.find({}).sort({ views: 'desc' });
      res.status(200).render('index', { newItems, allItems, loggedinUser });
   }
};