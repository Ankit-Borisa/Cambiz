
const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}


const otpSchema = new mongoose.Schema({
    otp_value: {
        type: Number,
        required: true
    },
    emailid: {
        type: String,
        required: true
    },
    date_time: {
        type: Date,
        default: getISTTime,
        // required: true
    },
    otp_for: {
        type: String,
        enum: ['verification', 'fp', 'registration'],
        // required: true
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
})


module.exports = mongoose.model("otp", otpSchema);

