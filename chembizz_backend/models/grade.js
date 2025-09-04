// Import mongoose
const mongoose = require('mongoose');

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define the schema
const gradeSchema = new mongoose.Schema({
  grade_name: {
    type: String,
    required: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create and export the model
const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;
