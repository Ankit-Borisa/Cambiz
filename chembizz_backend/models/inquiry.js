
const mongoose = require('mongoose');
const { Schema } = mongoose;

function getISTTime() {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

// Define Inquiry Schema
const inquirySchema = new Schema({
  buyer_company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company'
  },
  seller_company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  inq_type: {
    type: String,
    enum: ['commercial', 'sample inquiry'],
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
  grade: {
    type: String,
    // required: true
  },
  country_origin: {
    type: String,
    required: true
  },
  supply_capacity: {
    type: Number,
    required: true
  },
  purity: {
    type: String,
    required: true
  },
  COA: {
    type: String,
    // required: true
  },
  inquiry_qty: {
    type: Number,
    // required: true
  },
  qty_type: {
    type: String,
    enum: ['mg', 'gm', 'kg'],
    // required: true
  },
  min_price: {
    type: Number,
    // required: true
  },
  max_price: {
    type: Number,
    // required: true
  },
  payment_terms: {
    type: String,
    enum: ["Advance", "Immediate", "15 Days Credit", "30 Days Credit", "45 Days Credit"]
  },
  delivery_time: {
    type: String,
    enum: ["Immediate", "Delivery in 15 Days", "Delivery in 30 Days"]
  },
  inco_terms: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancel', 'deal done', 'negotation', 'po', 'invoice', 'dispatch', 'in transit', 'delivered'],
    default: 'pending'
  },
  one_lot_qty: {
    type: Number,
    // required: true
  },
  hsn_code: {
    type: String,
    // required: true
  },
  one_lot_qty_type: {
    type: String,
    // required: true
  },
  one_lot_qty_price: {
    type: Number,
    // required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'rejcet'],
    // enum: ['pending', 'paid', 'reject'],
    // required: true
  },
  payment_type: {
    type: String,
    // required: tru
  },
  total_lot: {
    type: Number
  },

  createdAt: { type: Date, default: getISTTime }, // Add createdAt field with default value
  updatedAt: { type: Date, default: getISTTime }, // Add updatedAt field with default value

});

// Create Inquiry model
const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;



