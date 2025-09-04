const mongoose = require('mongoose');


function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
})

const subscriber = mongoose.model('subscriber', subscriberSchema);

module.exports = subscriber;