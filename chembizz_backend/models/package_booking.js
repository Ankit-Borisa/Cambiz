const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const packageBookingSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership_plan'
    },
    transaction_id: {
        type: String,
    },
    booking_date: {
        type: Date,
        default: getISTTime
    },

    daysCount:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:['active','inactive','expired'],
        default:'inactive'
    },
    
    // package_feature: [
    //     {
    //         membership_feature_id: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'membership_feature'
    //         }
    //     }
    // ],
    // package_days: {
    //     type: Number,
    //     required: true
    // },
    payment_mode: {
        type: String,
        required: true
    },
    // payment_ammout: {
    //     type: Number,
    //     required: true
    // },
    // package_name: {
    //     type: String,
    //     required: true
    // },
    payment_status: {
        type: String,
        enum: ['paid', 'unpaid'],
        // required: true
    },
    // payment_id: {
    //     type: mongoose.Schema.Types.ObjectId
    // },
    createdAt: { type: Date, default: getISTTime },
    updatedAt: { type: Date, default: getISTTime },
});

module.exports = mongoose.model('package_booking', packageBookingSchema)