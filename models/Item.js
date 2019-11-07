const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define user Schema
const ItemSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   price: {
      type: Number
   },
   smallIntro: {
      type: String,
      required: true
   },
   details: {
      type: String,
      required: true
   },
   link: {
      type: String
   },
   date: {
      type: Date,
      default: Date.now
   }
});

// Create a Schema named 'User' for MongoDB, based on UserSchema above
const Item = mongoose.model('items', ItemSchema);

// Export it so we can use in other files
module.exports = Item;