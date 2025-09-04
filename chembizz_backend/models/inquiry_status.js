const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const inquiryStatusSchema = new mongoose.Schema({
    inquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry'
    },
    inquiry_status_value: [
        {
            status: {
                type: String,
                enum: ["Inquiry", "Under Review", "Negotiation", "Deal", "Po", "Invoice", "Dispatch", "In Transit", "Delivered", "Rejected", "Cancel"],
                required: true
            },
            dateAndTime: {
                type: Date,
                default: Date.now
            },

        },
    ],
    status_change_by_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});

module.exports = mongoose.model('inquiry_status', inquiryStatusSchema)                                      