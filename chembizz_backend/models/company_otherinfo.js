const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Company Other Info Schema
const companyOtherInfoSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  logo: {
    type: String, // Assuming it can be a file path or URL to the logo
    // required: true
  },
  banner: {
    type: String,
  },
  website: {
    type: String,
    // required: true
  },
  other_emailid: {
    type: String,
  },
  other_contactno: {
    type: String,
  },
  fb: {
    type: String,
  },
  insta: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value
});

// Create Company Other Info model
const CompanyOtherInfo = mongoose.model(
  "CompanyOtherInfo",
  companyOtherInfoSchema
);

module.exports = CompanyOtherInfo;
