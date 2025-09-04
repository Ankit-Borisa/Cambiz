const mongoose = require("mongoose");
const membership_feature_schema = require("../models/membership_feature_schema");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");



const add_membership_feature = async (req, res) => {
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
        let memberShipData = new membership_feature_schema({
            feature_name: req.body.feature_name
        });
        let result = await memberShipData.save();
        res.status(200).json({
            success: true,
            message: "Membership Add Successfully",
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const display_membership_feature = async (req, res) => {
    try {
        let memberShipData = await membership_feature_schema.find();
        if (memberShipData) {
            res.status(200).json({
                success: true,
                message: "MemberShip find successfully",
                data: memberShipData
            })
        } else {
            res.status(400).json({
                success: false,
                message: "MemberShip Not Found!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const display_membership_feature_byid = async (req, res) => {
    try {
        let membershipId = req.params.membershipId
        let memberShipData = await membership_feature_schema.findById(membershipId)
        if (memberShipData) {
            res.status(200).json({
                success: true,
                message: "MemberShip find successfully",
                data: memberShipData
            })
        } else {
            res.status(400).json({
                success: false,
                message: "MemberShip Not Found!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const update_membership_feature = async (req, res) => {
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
        let membershipId = req.params.membershipId
        if (!membershipId) {
            return res.status(401).json({
                success: false,
                message: "Membership Not Found!"
            })
        }
        let updatedData = await membership_feature_schema.findByIdAndUpdate(membershipId, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Membeship data update successfully",
            data: updatedData
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const delete_membership_feature = async (req, res) => {
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
        let membershipId = req.params.membershipId
        if (!membershipId) {
            return res.status(401).json({
                success: false,
                message: "Membership Not Found!"
            })
        }
        let deletedData = await membership_feature_schema.findByIdAndDelete(membershipId);
        res.status(200).json({
            success: true,
            message: "Membeship data delete successfully",
            data: deletedData
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
    add_membership_feature: [verifyToken, add_membership_feature],
    display_membership_feature,
    display_membership_feature_byid,
    update_membership_feature: [verifyToken, update_membership_feature],
    delete_membership_feature: [verifyToken, delete_membership_feature],
    verifyAccessToken
}