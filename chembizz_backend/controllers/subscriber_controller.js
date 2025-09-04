const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const subscriber = require("../models/subscriber");

const addSubscriber = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const newSubscriber = new subscriber({
            email
        });

        await newSubscriber.save();
        return res.status(200).json({ message: 'Subscriber added successfully', data: newSubscriber });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already subscribed' });
        } else {
            return res.status(500).json({ error: 'An error occurred while adding the subscriber', details: error.message });
        }
    }
}

const getAllSubscriber = async (req, res) => {
    try {
        const subscribers = await subscriber.find();
        if (!subscribers) {
            return res.status(404).send({ message: "subscriber not found" });
        }
        return res.status(200).json({
            message: "subscribers retrived successfully",
            subscriber: subscribers
        })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    addSubscriber,
    getAllSubscriber: [verifyToken, getAllSubscriber],
    verifyAccessToken
};
