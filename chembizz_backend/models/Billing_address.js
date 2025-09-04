const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define the schema
const Billing_address = new Schema({
  bill_to_address: {
    type: String,
    required: true
  },
  bill_to_country: {
    type: String,
    required: true
  },
  bill_to_state: {
    type: String,
    required: true
  },
  bill_to_city: {
    type: String,
    required: true
  },
  bill_to_pin: {
    type: String,
    required: true
  },
  ship_to_address: {
    type: String,
    required: true
  },
  ship_to_country: {
    type: String,
    required: true
  },
  ship_to_state: {
    type: String,
    required: true
  },
  ship_to_city: {
    type: String,
    required: true
  },
  ship_to_pin: {
    type: String,
    required: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Reference to the Company model
    required: true
  },
  datetime: {
    type: Date,
    default: getISTTime
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create and export the model
const BillingAddress = mongoose.model('BillingAddress', Billing_address);
module.exports = BillingAddress;
