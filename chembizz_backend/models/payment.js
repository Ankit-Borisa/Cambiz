const mongoose = require("mongoose");


function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const paymentSchema = new mongoose.Schema({
    paid_amount: {
        type: Number,
        required: true
    },
    payment_mode: {
        type: String,
        // required: true
    },
    trnsaction_id: {
        type: String,
        // required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    inquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inquiry"
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String
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


module.exports = mongoose.model("payment", paymentSchema)