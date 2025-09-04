const mongoose = require("mongoose");
const TeamsAndCondition = require("../models/terms_and_conditions");
const { verifyToken, verifyAccessToken } = require("../middleware/generateAccessToken");






const insertData = async (req, res) => {
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
        let companyId = decodedToken.companyId
        let { values, terms_and_condition_title, design_for } = req.body

        let data = new TeamsAndCondition({
            company_id: companyId,
            values,
            design_for,
            terms_and_condition_title
        });

        let result = await data.save();
        res.status(200).json({
            success: true,
            message: "TeamsAndCondition Add Successfully",
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

const editData = async (req, res) => {
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

        let termsAndConditionsId = req.params.id

        // Update document based on the company ID stored in the token
        let updateData = await TeamsAndCondition.findOneAndUpdate({ _id: termsAndConditionsId }, req.body, { new: true });

        if (!updateData) {
            return res.status(404).json({
                success: false,
                message: "TeamsAndCondition Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "TeamsAndCondition Updated Successfully",
            data: updateData
        });

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
        let displayData = await TeamsAndCondition.find({ company_id: decodedToken.companyId });
        if (!displayData) {
            return res.status(200).json({
                success: false,
                message: "Teams And Condition Not Available!"
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
        });
    }
}


const deleteTermsAndCondition = async (req, res) => {
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
        let termsAndConditionsId = req.params.id

        let deleteData = await TeamsAndCondition.findByIdAndDelete(termsAndConditionsId)

        if (!deleteData) {
            return res.status(401).json({
                success: false,
                message: "TermsAndCondition Id Not Found!"
            })
        }
        res.status(200).json({
            success: true,
            message: "TermsAndCondition Delete Successfully",
            data: deleteData
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
    insertData: [verifyToken, insertData],
    editData: [verifyToken, editData],
    displayData: [verifyToken, displayData],
    deleteTermsAndCondition: [verifyToken, deleteTermsAndCondition],
    verifyAccessToken
}