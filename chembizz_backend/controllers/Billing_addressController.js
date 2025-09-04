const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BillingAddress = require('../models/Billing_address');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const mongoose = require('mongoose');

const addBillingAddress = async (req, res, next) => {
    try {
        // Extract token from request headers
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

        // Check if the provided company_id matches the company ID in the token
        // if (req.body.company_id !== decodedToken.companyId) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to add billing address for other companies' });
        // }

        // Extract data from request body
        const {
            bill_to_address,
            bill_to_country,
            bill_to_state,
            bill_to_city,
            bill_to_pin,
            ship_to_address,
            ship_to_country,
            ship_to_state,
            ship_to_city,
            ship_to_pin
        } = req.body;

        // Validate input data
        if (!bill_to_address || !bill_to_country || !bill_to_state || !bill_to_city || !bill_to_pin ||
            !ship_to_address || !ship_to_country || !ship_to_state || !ship_to_city || !ship_to_pin) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Create a new billing address document
        const newBillingAddress = new BillingAddress({
            bill_to_address,
            bill_to_country,
            bill_to_state,
            bill_to_city,
            bill_to_pin,
            ship_to_address,
            ship_to_country,
            ship_to_state,
            ship_to_city,
            ship_to_pin,
            company_id: decodedToken.companyId
        });

        // Save the new billing address to the database
        await newBillingAddress.save();

        // Send success response
        return res.status(201).json({ success: true, message: 'Billing address added successfully', billingAddress: newBillingAddress });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const editBillingAddressById = async (req, res, next) => {
    try {
        // Extract token from request headers
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

        // Extract data from request body
        const billingAddressData = req.body;

        // Check if the provided company_id matches the company ID in the token
        if (billingAddressData.company_id) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to edit billing address for other companies' });
        }

        // Check if the billing address exists
        const existingBillingAddress = await BillingAddress.findById(req.params.id);

        if (!existingBillingAddress) {
            return res.status(404).json({ success: false, message: 'Billing address not found' });
        }

        // Update the existing billing address with the provided data
        existingBillingAddress.set(billingAddressData);
        existingBillingAddress.updatedAt = Date.now(); // Update the updatedAt field

        // Save the updated billing address to the database
        await existingBillingAddress.save();

        // Send success response along with the updated billing address
        return res.status(200).json({ success: true, message: 'Billing address updated successfully', billing_address: existingBillingAddress });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};





const displayAllBillingAddresses = async (req, res, next) => {
    try {
        // Extract token from request headers
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

        // Check if the provided company_id matches the company ID in the token
        // if (req.body.company_id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access for this company' });
        // }

        // Retrieve billing addresses for the company from the database
        const billingAddresses = await BillingAddress.find({ company_id: decodedToken.companyId });

        // Send success response with the retrieved billing addresses
        return res.status(200).json({
            success: true,
            message: 'Billing addresses retrieved successfully',
            billing_addresses: billingAddresses
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const displayBillingAddressById = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role || decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Extract billing address ID from request parameters
        // const { id } = req.params;

        // Retrieve the billing address from the database by ID
        const billingAddress = await BillingAddress.findOne({ company_id: decodedToken.companyId });

        // Check if the billing address exists
        if (!billingAddress) {
            return res.status(200).json({ success: false, message: 'Billing address not available' });
        }

        // Check if the user is authorized to access the billing address
        // if (billingAddress.company_id.toString() !== decodedToken.companyId) {
        //     // User is not the owner of the billing address, deny access
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to billing address of other companies' });
        // }

        // Send success response with the retrieved billing address
        return res.status(200).json({
            success: true,
            message: 'Billing address retrieved successfully',
            billingAddress: billingAddress
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};





module.exports = {
    addBillingAddress: [verifyToken, addBillingAddress],
    editBillingAddressById: [verifyToken, editBillingAddressById],
    displayAllBillingAddresses: [verifyToken, displayAllBillingAddresses],
    displayBillingAddressById: [verifyToken, displayBillingAddressById],
    verifyAccessToken

}