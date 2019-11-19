module.exports = {

   // Get dashboard
   index: async (req, res, next) => {
      const loggedinUser = req.user;
      res.status(200).render('users/sellers/dashboard', { loggedinUser })

   }

};