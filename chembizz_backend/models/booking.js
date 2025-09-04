const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const bookingSchema = new mongoose.Schema({
    book_package: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership_plan_schema'
    },
    bookingDate: {
        type: Date,
        required: getISTTime
    },
    payment_status: {
        type: "String",
        enum: ['paid', 'unpaid'],
        default: 'paid'
    },
    createdAt: { type: Date, default: getISTTime },
    updatedAt: { type: Date, default: getISTTime },
});

module.exports = mongoose.model('booking', bookingSchema)