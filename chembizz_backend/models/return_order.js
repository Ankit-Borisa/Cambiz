const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const returnOrder = new mongoose.Schema({
    inquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inquiry'
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    total_return_qty: {
        type: Number,
        required: true
    },
    qty_type: {
        type: String,
        required: true
    },
    total_return_amount: {
        type: Number,
        required: true
    },
    date_time: {
        type: Date,
        default: getISTTime
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});

module.exports = mongoose.model('return_order', returnOrder)