const mongoose = require("mongoose");
const Notification = require("../models/notification");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");



const displayNotification = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let notificationData = await Notification.find({ company_id: decodedToken.companyId });
        if (notificationData) {
            res.status(200).json({
                success: true,
                message: "Notification find successfully",
                data: notificationData
            })
        } else {
            res.status(400).json({
                success: true,
                message: "Notification not found!"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const notificationUpdate = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let updateData = await Notification.updateMany({ company_id: decodedToken.companyId }, { $set: { status: 'read' } }, { new: true })

        res.status(200).json({
            success: true,
            message: "Notificatoin status change successfully",
            data: updateData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    displayNotification: [verifyToken, displayNotification],
    notificationUpdate: [verifyToken, notificationUpdate],
    verifyAccessToken
}