const mongoose = require("mongoose");

const request_demo_schema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true
    },
    contact_person_name: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    contact_date: {
        type: Date,
        required: true
    },
    contact_time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'demo_done', 'request_cancel'],
        default: 'pending'
    }
});

module.exports = mongoose.model("request_demo", request_demo_schema)