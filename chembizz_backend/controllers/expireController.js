const mongoose = require("mongoose");
const ExpireData = require("../models/expireDate");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");




const insertExpire = async (req, res) => {
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
        let { days } = req.body
        let expireData =  new ExpireData({
            days
        });
        let result = await expireData.save();
        res.status(200).json({
            success: true,
            message: "Expire Insert Successfully",
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



const displayExpireData = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        let decodedToken;
        try {
            decodedToken = verifyAccessToken(token);
        } catch (error) {
            return res.status(401).json({ success: false, message: 'unauthorized: invalid token' });
        }

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized: No role found in token' });
        }

        // Proceed to add product if the user has the required role
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized: insufficient role privileges' });
        }
        let expireData = await ExpireData.find();
        if (expireData) {
            res.status(200).json({
                success: true,
                message: "ExpireData Find Successfully",
                data: expireData
            })
        } else {
            res.status(200).json({
                success: true,
                message: "ExpireData Not Found!",
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}



const editExpireData = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        let decodedToken;
        try {
            decodedToken = verifyAccessToken(token);
        } catch (error) {
            return res.status(401).json({ success: false, message: 'unauthorized: invalid token' });
        }

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized: No role found in token' });
        }

        // Proceed to add product if the user has the required role
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized: insufficient role privileges' });
        }
        let expireId = req.params.expireId
        if (!expireId) {
            return res.status(401).json({
                success: false,
                message: "Expire Not Found!"
            })
        }
        let data = await ExpireData.findByIdAndUpdate(expireId, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "ExpireData Edit Successfully",
            data: data
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
    displayExpireData: [verifyToken, displayExpireData],
    editExpireData: [verifyToken, editExpireData],
    insertExpire: [verifyToken, insertExpire],
    verifyAccessToken
}