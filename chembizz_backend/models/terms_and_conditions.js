const mongoose = require("mongoose");
const terms_and_conditions = require("../controllers/terms_and_conditions");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const termsAndConditionsSchema = new mongoose.Schema({
    values: {
        type: String,
        required: true
    },
    terms_and_condition_title: {
        type: String,
        required: true
    },
    design_for: {
        type: String,
        required: true
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});


module.exports = mongoose.model("teamsAndCondition", termsAndConditionsSchema)