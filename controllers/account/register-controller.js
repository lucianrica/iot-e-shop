const bcrypt = require('bcryptjs');
const User = require('../../models/User');

module.exports = {

   //  Get Register page
   index: (req, res, next) => {
      const loggedinUser = req.user;
      res.status(200).render('account/register', { loggedinUser });
   },

   //  Create new user
   newUser: async (req, res, next) => {
      const loggedinUser = req.user;
      const { firstName, lastName, email, password, confirmPassword } = req.body;
      let errors = [];

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
         errors.push({ msg: 'Please enter all fields' });
      }
      if (password != confirmPassword) {
         errors.push({ msg: 'Passwords do not match' });
      }
      if (password.length < 6) {
         errors.push({ msg: 'Password must be at least 6 characters' });
      }
      if (errors.length > 0) {
         return res.status(409).render('account/register', { loggedinUser, errors });
      }

      const user = await User.findOne({ email: email });
      if (user) {
         errors.push({ msg: 'Email already exists' })
         return res.status(409).render('account/register', { loggedinUser, errors });
      }

      const newUser = new User({ firstName, lastName, email, password });
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            await newUser.save()
            req.flash('success_msg', 'You are now registered and can log in');
            res.status(201).redirect('login');
         });
      });
   }    
};
