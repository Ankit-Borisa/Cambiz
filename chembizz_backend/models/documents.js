const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Documents Schema
const documentsSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  certificate_name: {
    type: String,
    required: true
  },
  certificate_no: {
    type: String,
    required: true
  },
  issue_date: {
    type: Date,
    required: true
  },
  valid_till: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'inactive'],
  },
  doc_file: {
    type: String,
    required: true

  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create Documents model
const Documents = mongoose.model('Documents', documentsSchema);

module.exports = Documents;




