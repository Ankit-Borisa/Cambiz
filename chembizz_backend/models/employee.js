const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Employee Schema
const employeeSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  employee_name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  emailid: {
    type: String,
    required: true
  },
  mobile_no: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
