const mongoose = require("mongoose");
const MyDesign = require("../models/myDesign");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");
const design = require("../models/design");

const {Azure_Storage_Base_Url} = require("../utils/blobUrl");



const createMyDesign = async (req, res) => {
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

        let extisData = await MyDesign.findOne({ design_for: req.body.design_for });

        if (extisData) {
            return res.status(400).json({
                success: true,
                message: "Data Aready Extis!"
            })
        }

        let newData = new MyDesign({
            company_id: decodedToken.companyId,
            po_design: req.body.po_design,
            invoice_design: req.body.invoice_design,
            credit_design: req.body.credit_design,
            debit_design: req.body.debit_design
        });

        let result = await newData.save();



        res.status(200).json({
            success: true,
            message: "MyDesign Add Successfully",
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
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        let displayData = await MyDesign.aggregate([
            {
                $lookup: {
                    from: 'designs',
                    localField: 'design_id',
                    foreignField: '_id',
                    as: 'design_details'
                }
            },
        ]);
        if (displayData.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'My-Design Not Avilable',
                data: []
            });
        }

        displayData = displayData.map(item => {
            item.design_details = item.design_details.map(detail => {
                detail.design_photo = Azure_Storage_Base_Url + detail.design_photo;
                return detail;
            });
            return item;
        });


        res.status(200).json({
            success: true,
            message: "My Design Find Successfully",
            data: displayData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const myDesignDisplayByToken = async (req, res) => {
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
        let displayData = await MyDesign.aggregate([
            {
                $match: {
                    company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                }
            },
        ]);
        if (displayData.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'My-Design Not Avilable',
                data: []
            });
        }


        res.status(200).json({
            success: true,
            message: "My Design Find Successfully",
            data: displayData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const removeMyDesign = async (req, res) => {
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

        let { id } = req.params

        let deleteData = await MyDesign.findByIdAndDelete(id)

        if (!deleteData) {
            return res.status(401).json({
                success: false,
                message: "My-Design Id Not Found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "My-Design Remove Successfully",
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

const editMyDesign = async (req, res) => {
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

        let { id } = req.params

        let updateData = {
            po_design: req.body.po_design,
            invoice_design: req.body.invoice_design,
            credit_design: req.body.credit_design,
            debit_design: req.body.debit_design
        }

        let updatedData = await MyDesign.findOneAndUpdate({ _id: id }, updateData, { new: true });


        res.status(200).json({
            success: true,
            message: "My Design Data Successfully",
            data: updatedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    createMyDesign: [verifyToken, createMyDesign],
    displayList: [verifyToken, displayList],
    removeMyDesign: [verifyToken, removeMyDesign],
    editMyDesign: [verifyToken, editMyDesign],
    myDesignDisplayByToken: [verifyToken, myDesignDisplayByToken],
    verifyAccessToken
}