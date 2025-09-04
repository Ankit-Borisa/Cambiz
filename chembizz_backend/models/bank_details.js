const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const bankDetailsSchema = new Schema({
  bank_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true,
    unique: true
  },
  branch_code: {
    type: String
  },
  IFSC_code: {
    type: String,
    required: true
  },
  branch_address: {
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
  pinCode: {
    type: String,
    required: true
  },
  cancel_cheque_photo: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["primary", "secondary"]
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  dateTime: {
    type: Date,
    default: getISTTime
  },
  status: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    currentTime: () => getISTTime()
  }
}); // Add createdAt and updatedAt fields with default values

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);

module.exports = BankDetails;
