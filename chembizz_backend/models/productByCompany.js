const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const productByCompanySchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    CAS_number: {
        type: String,
        required: true
    },
    name_of_chemical: {
        type: String,
        required: true
    },
    structure: { //Image
        type: String,

    },
    molecularFormula: {
        type: String,


    },
    mol_weight: {
        type: String,


    },
    synonums: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'unavailable'],
        default: 'active'
    },
    // New Fields
    IUPAC_name: {
        type: String
    },
    Appearance: {
        type: String
    },
    storage: {
        type: String
    },
    verified: { 
        type: Boolean,
        default: false
        // new add 
    }, 
    createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
    updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

const productByCompany = mongoose.model('productByCompany', productByCompanySchema);

module.exports = productByCompany;
