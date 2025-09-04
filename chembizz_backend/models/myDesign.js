const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const myDesignSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    po_design: {
        type: String,
        required: true
    },
    invoice_design: {
        type: String,
        required: true
    },
    credit_design: {
        type: String,
        required: true
    },
    debit_design: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});


module.exports = mongoose.model('myDesign', myDesignSchema)