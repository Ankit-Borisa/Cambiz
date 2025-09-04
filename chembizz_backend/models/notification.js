const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const notificationScehma = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    inquiry_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    dateAndTime: {
        type: Date,
        default: getISTTime
    },
    createdAt: { type: Date, default: getISTTime },
    updatedAt: { type: Date, default: getISTTime },
});

module.exports = mongoose.model('notification', notificationScehma)