const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Company Schema
const companySchema = new Schema({
  company_name: {
    type: String,
    required: true
  },
  gst: {
    type: String,
    required: true
  },
  contact_person_name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mobile_num: {
    type: String,
    required: true
  },
  landline_num: {
    type: String,

  },
  emailid: {
    type: String,
    required: true,
    unique: true
  },
  mode_of_business: {
    type: [String], // Changed type to array of strings
    enum: ['manufacture', 'trader'],
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  membership_status: {
    type: String,
    enum: ['free', 'paid', 'expired'],
    default: 'paid'
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create Company model
const Company = mongoose.model('Company', companySchema);

module.exports = Company;




