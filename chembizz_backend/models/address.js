const mongoose = require('mongoose');

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    enum: ['bill_to', 'ship_to'],
    // required: true
  },
  address: {
    type: String,
    // required: true
  },
  city: {
    type: String,
    // required: true
  },
  state: {
    type: String,
    // required: true
  },
  country: {
    type: String,
    // required: true
  },
  pincode: {
    type: Number,
    // required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    // required: true
  }
}, {
  timestamps: {
    currentTime: () => getISTTime() // Use custom function for timestamps
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
