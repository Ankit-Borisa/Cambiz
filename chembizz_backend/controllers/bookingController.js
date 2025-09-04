const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Company = require("../models/company");
const Package = require("../models/membership_plan_schema")
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");


const insertBooking = async (req, res) => {
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

        const companyId = decodedToken.companyId;

        const exitsBookingDetails = await Booking.findOne({ companyId: decodedToken.companyId });
        if (exitsBookingDetails) {
            return res.status(400).json({
                success: false,
                message: "Booking details already exist for this company"
            })
        }
    
        const bookingData = new Booking({
            book_package: req.body.book_package,
            companyId: companyId,
            packageId: req.body.packageId,
            bookingDate: req.body.bookingDate,
            payment_status: req.body.payment_status
        });

        // Save the booking data
        const result = await bookingData.save();

        // Update company membership status
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: companyId },
            { $set: { membership_status: req.body.membership_status } },
            { new: true }
        );

        // Respond with success message and data
        res.status(200).json({
            success: true,
            message: "Booking Inserted Successfully and Company Membership Status Updated",
            data: {
                booking: result,
                company: updatedCompany
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const displayBooking = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token);

        // Ensure the token is valid and contains necessary information
        if (!decodedToken || !decodedToken.role) {
            // || !decodedToken.companyId
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user has the required role
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Query bank details from the database by ID
        const bookingDetails = await Booking.find({ companyId: decodedToken.companyId });

        // If bank details do not exist for this ID, return an error
        if (!bookingDetails) {
            return res.status(200).json({ success: false, message: 'Booking details not available' });
        }

        res.status(200).json({
            success: true,
            message: 'Booking details retrieved successfully',
            bookingData: bookingDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    insertBooking: [verifyToken, insertBooking],
    displayBooking: [verifyToken, displayBooking],
    verifyAccessToken
}