const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const membership_feature = new mongoose.Schema({
    membership_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    membership_feature_status: {
        type: Boolean
    },
})

const membership_plan = new mongoose.Schema({
    plan_name: {
        type: String,
        required: true
    },
    plan_days: {
        type: Number,
        require: true
    },
    plan_original_price: {
        type: Number,
        require: true
    },
    plan_selling_price: {
        type: Number,
        require: true
    },
    membership_feature_id: {
        type: [membership_feature],
        required: true
    },
    sequence: {
        type: Number,
        // required: true
    },
    catalog_limit: {
        type: Number
    },
    createdAt: { type: Date, default: getISTTime },
    updatedAt: { type: Date, default: getISTTime },
})

const membership_plan_schema = new mongoose.model('membership_plan', membership_plan);

module.exports = membership_plan_schema;