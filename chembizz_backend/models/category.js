const mongoose = require('mongoose');

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Category schema
const categorySchema = new mongoose.Schema({
  category_name: { 
    type: String, 
},
createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
