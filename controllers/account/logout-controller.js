module.exports = {

   // Logout to home page
   index: (req, res, next) => {
      req.logout();
      req.flash('success_msg', 'You are logged out');
      res.status(200).redirect('/');
   }
     
};
