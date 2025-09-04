const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const adminPrivacyPolicySchema = new mongoose.Schema({
    values: {
        type: String,
        required: true
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperAdmin',
        default: '65d3338cd133013105d8c24f'
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});


module.exports = mongoose.model("PrivacyPolicy", adminPrivacyPolicySchema)