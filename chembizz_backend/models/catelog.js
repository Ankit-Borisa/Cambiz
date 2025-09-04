const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Catalog Schema
const catalogSchema = new Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    // required: true
  },
  grade: [{
    type: String,
    // required: true
  }],
  COA: {
    type: String, // Assuming it can be a file path or URL to the photo/pdf
    required: true
  },
  min_price: {
    type: Number,
    required: true
  },
  max_price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    // enum: [1, 2, 3, 4, 5]
  },
  qty_type: {
    type: String,
    required: true,
    enum: ['mg', 'gm', 'kg']
  },
  active_chemicals: {
    type: String,
    required: true,
    enum: ['active', 'inactive']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive']
  },
  hsn_code: {
    type: String,
    required: true
  },
  country_origin: {
    type: String,
    required: true
  },
  supply_capacity: {
    type: String,
    required: true
  },
  purity: {
    type: String,
    required: true
  },
  one_lot_qty: {
    type: Number,
    required: true
  },
  one_lot_qty_type: {
    type: String,
    required: true,
    enum: ['mg', 'gm', 'kg']
  },
  one_lot_qty_price: {
    type: Number,
    required: true
  },
  max_lot_qty: {
    type: Number,
    required: true
  },
  sample_price: {
    type: Number,
    required: true
  },
  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value
});


// Create Catalog model
const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;
