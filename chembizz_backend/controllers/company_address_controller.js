const mongoose = require("mongoose");
const CompanyAddress = require("../models/company_address");
const { verifyAccessToken, verifyToken } = require("../middleware/generateAccessToken");



const insertCompanyAddress = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token (this line is just for demonstration, replace with your actual token verification function)
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        let { address_type, address_details, country, state, city, pincode } = req.body
        let addressData = new CompanyAddress({
            company_id: decodedToken.companyId,
            address_type,
            address_details,
            country,
            state,
            city,
            pincode
        });
        let result = await addressData.save();
        res.status(200).json({
            success: true,
            message: "Company Address Add Successfully",
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const editCompanyAddress = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token (this line is just for demonstration, replace with your actual token verification function)
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const { addressId } = req.params; // Assuming you are passing the address ID in the URL parameters
        const { address_type, address_details, country, state, city, pincode } = req.body;

        // Find the company address by ID
        let addressData = await CompanyAddress.findById(addressId);

        if (!addressData) {
            return res.status(404).json({ success: false, message: 'Company address not found' });
        }

        // Update the company address fields
        let updateData = {
            address_type,
            address_details,
            country,
            state,
            city,
            pincode
        }
        // Save the updated company address
        let addressUpdatedData = await CompanyAddress.findByIdAndUpdate(addressId, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Company Address Updated Successfully",
            data: addressUpdatedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const displayCompanyAddresses = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token (this line is just for demonstration, replace with your actual token verification function)
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Fetch all company addresses belonging to the logged-in company
        const companyAddresses = await CompanyAddress.find({ company_id: decodedToken.companyId });

        res.status(200).json({
            success: true,
            message: "Company Addresses Retrieved Successfully",
            data: companyAddresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const deleteCompanyAddress = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token (this line is just for demonstration, replace with your actual token verification function)
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        const { addressId } = req.params; // Assuming you are passing the address ID in the URL parameters

        // Find the company address by ID
        const addressData = await CompanyAddress.findByIdAndDelete(addressId);

        if (!addressData) {
            return res.status(404).json({ success: false, message: 'Company address not found' });
        }

        res.status(200).json({
            success: true,
            message: "Company Address Deleted Successfully",
            data: addressData
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
    insertCompanyAddress: [verifyToken, insertCompanyAddress],
    editCompanyAddress: [verifyToken, editCompanyAddress],
    displayCompanyAddresses: [verifyToken, displayCompanyAddresses],
    deleteCompanyAddress: [verifyToken, deleteCompanyAddress],

    verifyAccessToken
}