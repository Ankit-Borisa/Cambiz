const mongoose = require('mongoose');

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const productSchema = new mongoose.Schema({

  CAS_number: {
    type: String,
    required: true
  },
  name_of_chemical: {
    type: String,
    required: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    //new add
  },
  company_productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productByCompany",
    //new add 
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
    default: true
    // new add 
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
