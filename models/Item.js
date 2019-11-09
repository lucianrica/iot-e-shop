const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define user Schema
const ItemSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   salesPitch:{
      type: String,
      required: true
   },
   details: {
      type: String,
      required: true
   },
   photos: [String],
   date: {
      type: Date,
      default: Date.now
   },
   user: {
      type: String,
      required: true
   }
});


// Create a Schema named 'User' for MongoDB, based on UserSchema above
const Item = mongoose.model('items', ItemSchema);

// Export it so we can use in other files
module.exports = Item;