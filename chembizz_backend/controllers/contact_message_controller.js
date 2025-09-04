const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const contactMessage = require("../models/contact_message_schema");


const addMessage = async (req, res) => {
    try {
        const { fullName, email_id, contact_no, message, country, contact_for } = req.body;

        if (!fullName || !email_id || !contact_no || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newMessage = new contactMessage({
            fullName,
            email_id,
            contact_no,
            message,
            country,
            contact_for
        });
        await newMessage.save();

        return res.status(200).json({ message: 'Contact message added successfully', data: newMessage });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const getAllMessage = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const messages = await contactMessage.find();
        if (!messages) {
            return res.status(404).send({ message: "messages not found" });
        }
        return res.status(200).json({
            message: "messages retrived successfully",
            messages: messages
        })
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    addMessage,
    getAllMessage: [verifyToken, getAllMessage],
    verifyAccessToken
}