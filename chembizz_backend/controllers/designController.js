const mongoose = require("mongoose");
const Design = require("../models/design");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl");
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");



const createDesign = async (req, res) => {
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

        if(!req.file){
            return res.status(400).json({ success: false, message: 'Design Photo is required' });
        }

        let uploadResult = await uploadToAzureBlob(req.file);

        const uniqueFileName = uploadResult.uniqueFileName;

        let newDesign = new Design({
            design_photo: uniqueFileName,
            design_title: req.body.design_title
        });
        let result = await newDesign.save();
        res.status(200).json({
            success: true,
            message: "Design Add Successfully",
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

const displayList = async (req, res) => {
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
        let displayData = await Design.find()

        if (!displayData) {
            return res.status(401).json({
                success: false,
                message: "Design Not Found"
            })
        }
        displayData = displayData.map(item => {
            return {
                ...item.toObject(), // Convert the Mongoose document to a plain object
                design_photo: `${Azure_Storage_Base_Url}${item.design_photo}`
            };
        });

        res.status(200).json({
            success: true,
            message: "Design Find Successfully",
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

const companyDisplayList = async (req, res) => {
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

        let displayData = await Design.find()

        if (!displayData) {
            return res.status(401).json({
                success: false,
                message: "Design Not Found"
            })
        }

        displayData = displayData.map(item => {
            return {
                ...item.toObject(), // Convert the Mongoose document to a plain object
                design_photo: `${Azure_Storage_Base_Url}${item.design_photo}`
            };
        });

        res.status(200).json({
            success: true,
            message: "Design Find Successfully",
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

const removeDesign = async (req, res) => {
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
        let { designId } = req.params

        let deleteData = await Design.findByIdAndDelete(designId)

        if (!deleteData) {
            return res.status(401).json({
                success: false,
                message: "Design Id Not Found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Design Remove Successfully",
            data: deleteData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateDesign = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to update design if the user has the required role
        // Check if the user's role is 'superadmin' or 'admin'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        const { id } = req.params;
        const updateFields = {};

        if (req.file && req.file.filename) {
            updateFields.design_photo = req.file.filename;
        }
        if (req.body.design_title) {
            updateFields.design_title = req.body.design_title;
        }

        const updatedDesign = await Design.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedDesign) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        res.status(200).json({
            success: true,
            message: "Design updated successfully",
            data: updatedDesign
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};




module.exports = {
    createDesign: [verifyToken, createDesign],
    displayList: [verifyToken, displayList],
    removeDesign: [verifyToken, removeDesign],
    companyDisplayList: [verifyToken, companyDisplayList],
    updateDesign: [verifyToken, updateDesign],
    verifyAccessToken
}