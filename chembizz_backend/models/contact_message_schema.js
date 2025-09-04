const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const contactMessageSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    contact_no: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
    contact_for: {
        type: String,
    }
}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
})

const contactMessage = mongoose.model('contactMessage', contactMessageSchema);

module.exports = contactMessage;