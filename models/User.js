const mongoose = require('mongoose');
var Schema = mongoose.Schema;



// Define user Schema
const UserSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   userType: {
      type: Number,
      required: true,
      default: 0 
   },
   resetPasswordToken: {
      type: String, 
   },
   resetPasswordExpires: {
      type: Date
   },
   date: {
      type: Date,
      default: Date.now
   },
});

// Create a Schema named 'User' for MongoDB, based on UserSchema above
const User = mongoose.model('User', UserSchema);

// Export it so we can use in other files
module.exports = User;
