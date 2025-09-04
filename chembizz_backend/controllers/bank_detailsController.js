const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BankDetails = require('../models/bank_details');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const mongoose = require('mongoose');
const {uploadToAzureBlob, deleteFromAzureBlob}= require("../utils/blobUpload");
const {Azure_Storage_Base_Url} = require("../utils/blobUrl")


const addBankDetails = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token);

        // Ensure the token is valid and contains necessary information
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user has the required role
        if (decodedToken.role !== 'company' && decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract bank details from request body
        const { bank_name, account_number, branch_code, IFSC_code, branch_address, country, state, city, pinCode, status } = req.body;


        let existingBankDetails = await BankDetails.findOne({ account_number: account_number })
        if (existingBankDetails) {
            return res.status(400).json({
                success: false,
                message: "Account number already exits!"
            })
        }

        // Check if cancel_cheque_photo exists in the request body
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Cancel_cheque_photo is required' });
        }

        let uploadResult = await uploadToAzureBlob(req.file);
        const uniqueFileName = uploadResult.uniqueFileName;


        console.log("receiving the cheque file for upload ....")


        const cancel_cheque_photo = uniqueFileName;

        const bankDetailsCount = await BankDetails.countDocuments({ company_id: decodedToken.companyId });

        // Determine the priority based on the number of existing bank details
        let priority = bankDetailsCount === 0 ? 'primary' : 'secondary';

       
        // Create a new bank details document
        const newBankDetails = new BankDetails({
            bank_name,
            account_number,
            branch_code,
            IFSC_code,
            country,
            branch_address,
            state,
            city,
            pinCode,
            priority,
            cancel_cheque_photo, // Include full URL
            company_id: decodedToken.companyId, // Using companyId from the decoded token
            status
        });

        // Save the new bank details document to the database
        const savedBankDetails = await newBankDetails.save();

        // Return success response with full URL in the response body
        return res.status(200).json({
            success: true,
            message: 'Bank details added successfully',
            bank_details: {
                _id: savedBankDetails._id,
                bank_name,
                account_number,
                branch_code,
                IFSC_code,
                country,
                branch_address,
                state,
                city,
                pinCode,
                cancel_cheque_photo,
                company_id: decodedToken.companyId,
                status
            }
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




const editBankDetailsById = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token);

        // Ensure the token is valid and contains necessary information
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user has the required role
        if (decodedToken.role !== 'company' && decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract bank details ID from request parameters
        const { bankDetailsId } = req.params;

        // Check if the company has existing bank details
        const existingBankDetails = await BankDetails.findById(bankDetailsId);

        // If bank details do not exist for this ID, return an error
        if (!existingBankDetails) {
            return res.status(404).json({ success: false, message: 'Bank details not found for this ID' });
        }

        // Check if the user is a company and ensure the company ID associated with the bank details matches the company ID from the token
        // if (decodedToken.role === 'company' && existingBankDetails.company_id.toString() !== decodedToken.companyId) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to edit bank details of another company' });
        // }

        // Extract bank details from request body
        const { bank_name, account_number, branch_code, IFSC_code, branch_address, country, state, city, pinCode, status } = req.body;

        // Validate the status field
        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Status must be either "active" or "inactive".' });
        }

        let updateData = {
            bank_name,
            account_number,
            branch_code,
            IFSC_code,
            branch_address,
            country,
            state,
            city,
            pinCode,
            status
        }

        // Check if cancel_cheque_photo exists in the request body
        if (req.file) {
            // saveing the cheque in blobe.

            let uploadResult = await uploadToAzureBlob(req.file);
            const uniqueFileName = uploadResult.uniqueFileName;

            const existcheque = existingBankDetails?.cancel_cheque_photo;

            console.log("receiving the cheque_photo file for update ....")

            if (existcheque) {
                await deleteFromAzureBlob(existcheque);
            } else {
                console.log("No previous cheque_photo to delete");
            }

            updateData.cancel_cheque_photo = uniqueFileName;
        }

        // Save the updated bank details to the database
        let bankUpdateData = await BankDetails.findByIdAndUpdate(bankDetailsId, updateData, { new: true })

        // Return success response with updated bank details

        return res.status(200).json({
            success: true,
            message: 'Bank details updated successfully',
            bank_details: bankUpdateData
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


//getAllBankDetails
// const getAllBankDetails = async (req, res) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token);

//         // Ensure the token is valid and contains necessary information
//         if (!decodedToken || !decodedToken.role) {
//             // || !decodedToken.companyId
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Check if the user has the required role
//         if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Query all bank details from the database
//         let query = {};
//         if (decodedToken.role === 'company') {
//             // If the user is a company, only retrieve bank details associated with their company ID
//             query = { company_id: decodedToken.companyId };
//         }
//         const bankDetails = await BankDetails.find(query);

//         // Return success response with bank details
//         return res.status(200).json({
//             success: true,
//             message: 'Bank details retrieved successfully',
//             bank_details: bankDetails
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

const getAllBankDetails = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token);

        // Ensure the token is valid and contains necessary information
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Check if the user has the required role
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Query all bank details from the database
        let query = {};
        if (decodedToken.role === 'company') {
            // If the user is a company, only retrieve bank details associated with their company ID
            query = { company_id: decodedToken.companyId };
        }
        const bankDetails = await BankDetails.find(query);

        const bankDetailsDisplay = bankDetails.map(detail => {
            return {
                ...detail._doc, // Spread the original bank detail document
                cancel_cheque_photo: Azure_Storage_Base_Url + detail.cancel_cheque_photo // Add the full URL for the cancel cheque photo
            };
        });

        // Return success response with updated bank details
        return res.status(200).json({
            success: true,
            message: 'Bank details retrieved successfully',
            bank_details: bankDetailsDisplay
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


//getAllBankDetailsById
const getBankDetailsById = async (req, res) => {
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

        // Extract bank details ID from request parameters
        // const { bankDetailsId } = req.params;

        // Query bank details from the database by ID
        const bankDetails = await BankDetails.find({ company_id: decodedToken.companyId });

        // If bank details do not exist for this ID, return an error
        if (!bankDetails) {
            return res.status(200).json({ success: false, message: 'Bank details not found for this ID' });
        }

        const bankDetailsDisplay = bankDetails.map(detail => {
            return {
                ...detail._doc, // Spread the original bank detail document
                cancel_cheque_photo: Azure_Storage_Base_Url + detail.cancel_cheque_photo // Add the full URL for the cancel cheque photo
            };
        });

        // Return success response with bank details
        return res.status(200).json({
            success: true,
            message: 'Bank details retrieved successfully',
            bank_details: bankDetailsDisplay
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


const updateBankPriority = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token);

        // Ensure the token is valid and contains necessary information
        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user has the required role
        if (decodedToken.role !== 'company' && decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract bank detail ID from request body
        const { bankId } = req.params;

        // Check if bankId is provided
        if (!bankId) {
            return res.status(400).json({ success: false, message: 'Bank ID is required' });
        }

        // Find the selected bank detail by ID
        const selectedBankDetail = await BankDetails.findOne({ _id: bankId, company_id: decodedToken.companyId });
        if (!selectedBankDetail) {
            return res.status(404).json({ success: false, message: 'Bank detail not found' });
        }

        // Check if the selected bank is already primary
        if (selectedBankDetail.priority === 'primary') {
            return res.status(400).json({ success: false, message: 'Selected bank is already primary' });
        }

        // Find the current primary bank detail for this company
        const currentPrimaryBank = await BankDetails.findOne({ company_id: decodedToken.companyId, priority: 'primary' });

        // Update the current primary bank (if exists) to secondary
        if (currentPrimaryBank) {
            currentPrimaryBank.priority = 'secondary';
            await currentPrimaryBank.save();
        }

        // Update the selected bank detail to primary
        selectedBankDetail.priority = 'primary';
        const updatedBankDetail = await selectedBankDetail.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Bank priority updated successfully',
            data: updatedBankDetail
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



module.exports = {
    addBankDetails: [verifyToken, addBankDetails],
    editBankDetailsById: [verifyToken, editBankDetailsById],
    getAllBankDetails: [verifyToken, getAllBankDetails],
    getBankDetailsById: [verifyToken, getBankDetailsById],
    updateBankPriority: [verifyToken, updateBankPriority],
    verifyAccessToken

}