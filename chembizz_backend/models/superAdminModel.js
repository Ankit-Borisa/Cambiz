// superAdminModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const superAdminSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
