const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const stampSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    stampImage: {
        type: String,
        required: true
    },
    signImage: {
        type: String,
        required: true
    },
    stamp_status: {
        type: String,
        default: 'pending'
    },
    sign_status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: getISTTime
    },
    updatedAt: {
        type: Date,
        default: getISTTime
    },
});

module.exports = mongoose.model("Stamps", stampSchema)