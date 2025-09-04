const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const product_detail = new mongoose.Schema({
    cas_no: {
        type: String,
        // required: true
    },
    chem_name: {
        type: String,
        // required: true
    },
    mol_formula: {
        type: String,
        // required: true
    },
    hsn: {
        type: String,
        // required: true
    },
    qty: {
        type: Number,
        // required: true
    },
    qty_type: {
        type: String,
        // required: true
    },
    rate: {
        type: Number,
        // required: true
    },
    taxable_amount: {
        type: Number,
        // required: true
    },
    igst: {
        type: String,
        // required: true
    },
    cgst: {
        type: String,
        // required: true
    },
    sgst: {
        type: String,
        // required: true
    },
    gstAmount: {
        type: Number
    },
    total: {
        type: Number
    }
})

const bank_detail = new mongoose.Schema({
    bank_name: {
        type: String,
        // required: true
    },
    bank_branch: {
        type: String,
        // required: true
    },
    bank_IFSC_code: {
        type: String,
        // required: true
    },
    bank_account_num: {
        type: Number,
        // required: true
    },
})

const salesInvoiceSchema = new mongoose.Schema({
    buyer_company_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    inquiry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry'
    },
    seller_company_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    bill_to_gst_in: {
        type: String,
        // required: true
    },
    bill_to_name: {
        type: String,
        // required: true
    },
    bill_to_address: {
        type: String,
        // required: true
    },
    bill_to_country: {
        type: String,
        // required: true
    },
    bill_to_state: {
        type: String,
        // required: true
    },
    bill_to_city: {
        type: String,
        // required: true
    },
    bill_to_pincode: {
        type: Number,
        // required: true,
        // validate: {
        //     validator: function (v) {
        //         return /^\d{6}$/.test(v); // Checks if the value is a 6-digit number
        //     },
        //     message: props => `${props.value} is not a valid 6-digit pincode!`
        // }
    },
    bill_to_phone: {
        type: Number,
        // required: true,
        // validate: {
        //     validator: function (v) {
        //         const phoneNumber = v.toString(); // Convert to string to count digits
        //         return /^\d{8,15}$/.test(phoneNumber); // Checks if the value is between 8 and 10 digits long
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // }
    },
    shipped_to_gst_in: {
        type: String,
        // required: true
    },
    shipped_to_name: {
        type: String,
        // required: true
    },
    shipped_to_address: {
        type: String,
        // required: true
    },
    shipped_to_country: {
        type: String,
        // required: true
    },
    shipped_to_state: {
        type: String,
        // required: true
    },
    shipped_to_city: {
        type: String,
        // required: true
    },
    shipped_to_pincode: {
        type: Number,
        // required: true
    },
    shipped_to_phone: {
        type: Number,
        // required: true
    },
    invoice_no: {
        type: String,
        // required: true
    },
    invoice_date: {
        type: String,
        // default: Date.now
    },
    due_date: {
        type: String,
        default: ""
        // default: Date.now
    },
    po_num: {
        type: String,
        // required: true
    },
    po_date: {
        type: String,

    },
    inco_terms: {
        type: String,
        default: ""
        // required: true
    },
    payment_terms: {
        type: String,
        default: ""
        // enum: ["Advance", "Immediate", "15 Days Credit", "30 Days Credit", "45 Days Credit"]
    },
    // delivery_time: {
    //     type: String,
    //     default: ""
    //     // enum: ["Immediate", "Delivery in 15 Days", "Delivery in 30 Days"]
    // },
    upload_po: {
        type: String,
        // required: true
    },
    eway_no: {
        type: String,
        default: ""
        // required: true
    },
    vehicle_no: {
        type: String,
        default: ""
        // required: true
    },
    upload_COA: {
        type: String,
        // required: true
    },
    packaging_no_of_bags: {
        type: Number,
        default: 0
        // required: true
    },
    packaging_type: {
        type: String,
        default: ""
        // required: true
    },
    packaging_weight: {
        type: Number,
        default: 0
        // required: true
    },
    packaging_weight_type: {
        type: String,
        default: ""
        // required: true
    },
    grand_total: {
        type: Number,
        // required: true
    },
    termsand_condition: {
        type: String,
        // required: true
    },
    upload_sign: {
        type: String,
        // required: true
    },
    upload_stamp: {
        type: String,
        // required: true
    },
    invoice_type: {
        type: String,
        enum: ['tax_invoice', 'performa_invoice', 'po']
    },
    invoice_mode: {
        type: String,
        enum: ['manual', 'auto']
    },
    dateAndtime: {
        type: Date,
        default: Date.now
    },
    product_details: {
        type: [product_detail]
    },
    bank_details: {
        type: [bank_detail]
    },
    status: {
        type: String,
        default: 'generate'
    },
    lr_copy: {
        type: String
    },
    lori_copy: {
        type: String
    },
    inq_type: {
        type: String,
        enum: ['commercial', 'sample inquiry']
    },
    seller_to_gst_in: {
        type: String,
    },
    seller_to_name: {
        type: String,
    },
    seller_to_address: {
        type: String,
    },
    seller_to_country: {
        type: String,
    },
    seller_to_state: {
        type: String,
    },
    seller_to_city: {
        type: String,
    },
    seller_to_pincode: {
        type: Number,
    },
    seller_to_phone: {
        type: Number,
    },
    bill_to_logo: {
        type: String
    },
    design: {
        type: String
    },
    mode_of_transport:{
        type: String
    },
    createdAt: {
        type: Date,
        default: getISTTime
    },
    updatedAt: {
        type: Date,
        default: getISTTime
    },

});

module.exports = mongoose.model('salesInvoice', salesInvoiceSchema)