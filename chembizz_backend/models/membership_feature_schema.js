const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const membership_feature = new mongoose.Schema({
    feature_name:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: getISTTime
    },
    updatedAt: {
        type: Date,
        default: getISTTime
    }
})

const membership_feature_schema = new mongoose.model('membership_feature',membership_feature);

module.exports = membership_feature_schema;