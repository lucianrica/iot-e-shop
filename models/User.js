const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define user Schema
const UserSchema = new Schema({
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},   
   email: {type: String, required: true},
   password: {type: String, required: true},
   userType: {type: Number, required: true, default: 0},
   resetPasswordToken: {type: String},
   resetPasswordExpires: {type: Date},   
   profilePhoto: {type: String, default: '/public/img/profile-no-photo.png'},
   items: [{type: Schema.Types.ObjectId, ref: 'items'/* <- MongoDB name*/}],
   orders: [{type: Schema.Types.ObjectId, ref: 'orders'/* <- MongoDB name*/}],
   createdAt: {type: Date, default: Date.now},
   updatedAt: {type: Date, default: Date.now}
});

// Create a Schema named 'User' for MongoDB, based on UserSchema above
const User = mongoose.model('users', UserSchema);

// Export it so we can use in other files
module.exports = User;
