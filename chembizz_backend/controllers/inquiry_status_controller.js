const mongoose = require("mongoose");
const inquiry_status = require("../models/inquiry_status");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");



const insertStatus = async (req, res) => {
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

        const { inquiry_id, status } = req.body;

        // Find the inquiry status document
        let inquiryStatus = await inquiry_status.findOne({ inquiry_id: inquiry_id });

        if (!inquiryStatus) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found!"
            });
        }

        // Validate status
        const validStatuses = ["Under Review", "Negotiation", "Deal", "Po", "Invoice", "Dispatch", "In Transit", "Delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status!"
            });
        }

        const cancelExists = inquiryStatus.inquiry_status_value.some(statusEntry => statusEntry.status === 'Cancel');

        // If trying to push "Under Review" after "Cancel", block the request
        if (cancelExists && status === 'Under Review') {
            return res.status(400).json({
                success: false,
                message: "Cannot push 'Under Review' status after 'Cancel' status!"
            });
        }

        const statusExists = inquiryStatus.inquiry_status_value.some(statusEntry => statusEntry.status === status);
        if (statusExists) {
            return res.status(400).json({
                success: false,
                message: "Status already exists!"
            });
        }


        inquiryStatus.inquiry_status_value.push({
            status: status,
            dateAndTime: new Date(),

        });

        await inquiry_status.findByIdAndUpdate(inquiry_id, { status_change_by_id: decodedToken.companyId }, { new: true });

        await inquiryStatus.save();

        return res.status(200).json({
            success: true,
            message: "Inquiry status updated successfully!",
            inquiryStatus: inquiryStatus
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

const displayInquiryStatus = async (req, res) => {
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

        let { inquiry_id } = req.params

        let inquiryStausDisplayData = await inquiry_status.aggregate([
            {
                $match: { inquiry_id: new mongoose.Types.ObjectId(inquiry_id) }
            },
            {
                $lookup: {
                    from: 'inquiries',
                    localField: 'inquiry_id',
                    foreignField: '_id',
                    as: 'inquiry_details'
                }
            }
        ]);

        if (!inquiryStausDisplayData) {
            return res.status(200).json({
                success: false,
                message: "Inquiry Status Not Avaiable",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: "Inquiry Status Display Successfully",
            data: inquiryStausDisplayData
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

module.exports = {
    insertStatus: [verifyToken, insertStatus],
    displayInquiryStatus: [verifyToken, displayInquiryStatus],
    verifyAccessToken
}