const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const chatSchema = new mongoose.Schema({
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquiry"
    },
    message: {
        type: String,
        default: ""
        // required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true
    },
    datetime: {
        type: Date,
        default: getISTTime
    },
    quantity: {
        type: Number,
        // required: true
    },
    quantity_type: {
        type: String,
        // required: true
    },
    final_price: {
        type: Number,
        // required: true
    },
    inco_terms: {
        type: String,
        // required: true
    },
    payment_terms: {
        type: String,
        enum: ["Advance", "Immediate", "15 Days Credit", "30 Days Credit", "45 Days Credit"]
    },
    delivery_time: {
        type: String,
        enum: ["Immediate", "Delivery in 15 Days", "Delivery in 30 Days"]
    },
    request_status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'cancel'],
        default: 'pending'
    },
    status_change_by: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
    updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value
});

module.exports = mongoose.model('chat', chatSchema)