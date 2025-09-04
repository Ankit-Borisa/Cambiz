const mongoose = require("mongoose");
const stamdard_terms_and_condition = require("../models/standard_terms_and_condition");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");




const updateData = async (req, res) => {
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

        let { id } = req.params

        let updateData = await stamdard_terms_and_condition.findByIdAndUpdate(id, req.body, { new: true });

        if (!updateData) {
            return res.status(404).json({
                success: false,
                message: "Standard temrs and condition not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Standard terms and condition update successfully",
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



const displayData = async (req, res) => {
    try {

        let displayData = await stamdard_terms_and_condition.find();

        if (!displayData) {
            return res.status(404).json({
                success: false,
                message: "Standard terms and condition not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Standard terms and condition find successfully",
            data: displayData
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
    updateData: [verifyToken, updateData],
    displayData,

    verifyAccessToken
}