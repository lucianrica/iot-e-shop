module.exports = {

   // Get Dashboard
   index: async (req, res, next) => {
      const loggedinUser = req.user;
      res.status(200).render('users/shoppers/dashboard', { loggedinUser })

   }

};