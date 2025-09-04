const mongoose = require("mongoose");
const adminTeamsAndCondition = require("../models/admin_terms_and_condition");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");




const editData = async (req, res) => {
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
        let { adminId } = req.query
        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Teams And Condition Not Found!"
            })
        }

        let updateData = await adminTeamsAndCondition.findOneAndUpdate({ admin_id: adminId }, req.body, { new: true });

        res.status(200).json({
            success: true,
            message: "TeamsAndCondition Updated Successfully",
            data: updateData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

const displayData = async (req, res) => {
    try {
        // let { adminId } = req.query
        // if (!adminId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Admin Not Found!"
        //     })
        // }

        let displayData = await adminTeamsAndCondition.find();
        if (!displayData) {
            return res.status(400).json({
                success: false,
                message: "Teams And Condition Not Found!"
            })
        }
        res.status(200).json({
            success: true,
            message: "TeamsAndCondition Find Successfully",
            data: displayData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    editData: [verifyToken, editData],
    displayData,
    verifyAccessToken
}