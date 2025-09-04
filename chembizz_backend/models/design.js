const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const designSchema = new mongoose.Schema({
    design_photo: {
        type: String,
        required: true
    },
    design_title: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        currentTime: () => getISTTime() // Use custom function for timestamps
    }
});

module.exports = mongoose.model("Design", designSchema)