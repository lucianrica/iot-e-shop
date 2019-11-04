module.exports = {
   // Restrict users from accessing unwanted pages
   ensureAuthenticated: function (req, res, next) {
      if (req.isAuthenticated()) {
         return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
   },
   // Skips login process if authenticated
   forwardAuthenticated: function (req, res, next) {
      if (!req.isAuthenticated()) {
         return next();
      }
      res.redirect('/index');
   }
};