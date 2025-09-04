const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const expireSchema = new mongoose.Schema({
    days: {
        type: Number,
        default: 30,
        validate: {
            validator: function (value) {
                // Ensure days is not null and not zero
                return value !== null && value !== 0;
            },
            message: "Days must be a non-null, non-zero number"
        }
    },
    createdAt: {
        type: Date,
        default: getISTTime
    },
    updatedAt: {
        type: Date,
        default: getISTTime
    }
});

module.exports = mongoose.model('expire', expireSchema);
