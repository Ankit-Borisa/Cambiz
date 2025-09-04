const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema(
  {
    gstNo: { type: String, required: true },
    companyName: { type: String },
    contactPersonName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
  },
  { timestamps: true }
);

const GstData = mongoose.model("GstData", gstSchema);

module.exports = GstData;

// gstNo: { type: String, required: true, unique: true },
// companyName: { type: String },
// contactPersonName: { type: String },
// address: { type: String },
// city: { type: String },
// state: { type: String },
// pinCode: { type: String },
