const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const mongoose = require('mongoose');
const Address = require('../models/address');
const Inquiry = require('../models/inquiry'); // Import Inquiry model
const crypto = require('crypto');
const Product = require("../models/productModel");
const design = require('../models/design');
const MyDesign = require("../models/myDesign");
const CompanyOtherInfo = require('../models/company_otherinfo');
const { sendOTPEmail, generateOTP } = require('./otpController');
const otp = require('../models/otp');
const Notification = require('../models/notification');
const { getReceiverSocketId, io } = require("../socket/socket");
const Catalog = require('../models/catelog');
const package_booking = require('../models/package_booking');
const membership_plan_schema = require('../models/membership_plan_schema');
const SalesInvoice = require("../models/salesInvoice");
const uniqid = require("uniqid");
const { Azure_Storage_Base_Url } = require('../utils/blobUrl');


function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}



// Define register function
const register = async (req, res, next) => {
    try {
        // Ensure that required fields are present in the request body
        const requiredFields = ['company_name', 'gst', 'contact_person_name', 'mobile_num', 'emailid', 'mode_of_business', 'password', 'country', 'state', 'city', 'pincode'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `missing required fields: ${missingFields.join(', ')}` });
        }

        const existOtherInfoDetailsCheckEmail = await CompanyOtherInfo.findOne({ other_emailid: req.body.emailid });
        if (existOtherInfoDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in other information"
            });
        }

        const existOtherInfoDetailsCheckMobile = await CompanyOtherInfo.findOne({ other_contactno: req.body.mobile_num });
        if (existOtherInfoDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in other information"
            });
        }

        // Check if a company with the provided email already exists
        const existingCompany = await Company.findOne({ emailid: req.body.emailid });

        if (existingCompany) {
            return res.status(400).json({ message: 'a company with this email already exists' });
        }

        const existingCompanyMobile = await Company.findOne({ mobile_num: req.body.mobile_num });

        if (existingCompanyMobile) {
            return res.status(400).json({ message: 'a company with this mobile number already exists' });
        }

        const existingCompanyGst = await Company.findOne({ gst: req.body.gst });

        if (existingCompanyGst) {
            return res.status(400).json({ message: 'a company with this gst number already exists' });
        }

        // Ensure mode_of_business is an array and contains valid options
        const modeOfBusiness = Array.isArray(req.body.mode_of_business) ? req.body.mode_of_business.map(mode => mode.trim()) : [req.body.mode_of_business];

        // Allow mode_of_business to have one or both options
        const modeOfBusinessOptions = ['manufacture', 'trader'];
        const isValidModeOfBusiness = modeOfBusiness.every(mode => modeOfBusinessOptions.includes(mode));

        if (!isValidModeOfBusiness || modeOfBusiness.length < 1) {
            return res.status(400).json({ message: `invalid mode of business: ${req.body.mode_of_business}` });
        }

        let { emailid } = req.body;

        let hash = await bcrypt.hash(req.body.password, 10);
        // Create a new Company instance
        const newCompany = new Company({
            company_name: req.body.company_name,
            gst: req.body.gst,
            contact_person_name: req.body.contact_person_name,
            address: req.body.address, // Set address to null if not provided
            mobile_num: req.body.mobile_num,
            landline_num: req.body.landline_num, // landline number
            emailid: emailid,
            mode_of_business: modeOfBusiness, // Assign array of modes
            password: hash,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pincode,
            status: req.body.status
        });

        await newCompany.save();
        const notificationData = await Notification.create({
            company_id: newCompany._id,
            title: "Welcome Company",
            message: `Welcome ${req.body.company_name}`,
        })

        const adminSocketId = getReceiverSocketId(newCompany._id); // Implement this function to get the admin's socket ID
        if (adminSocketId) {
            io.to(adminSocketId).emit('newNotification', notificationData);
        }

        const merchantTransactionId = uniqid();

        const packageBooking = await package_booking.create({
            company_id: newCompany._id,
            plan_id: "6691181a99338f6889bd2bde",
            transaction_id: merchantTransactionId,
            booking_date: getISTTime(),
            payment_mode: "Free",
            payment_status: "paid",
            status: "active",
            
        });

        await Company.findOneAndUpdate({ _id: packageBooking.company_id }, { $set: { membership_status: "paid" } }, { new: true })

        const billToAddress = await Address.create({
            addressType: 'bill_to',
            address: null,
            city: null,
            state: null,
            country: null,
            pincode: null,
            companyId: newCompany._id
        });

        const shipToAddress = await Address.create({
            addressType: 'ship_to',
            address: null,
            city: null,
            state: null,
            country: null,
            pincode: null,
            companyId: newCompany._id
        });

        let newDesignData = new MyDesign({
            company_id: newCompany._id,
            po_design: 'design1',
            invoice_design: 'design1',
            credit_design: 'design1',
            debit_design: 'design1'
        });
        await newDesignData.save();


        return res.status(200).json({
            success: true,
            message: 'company registration is successful',
            company: newCompany,
            billToAddress,
            shipToAddress,
            newDesignData,
            packageBooking
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            error: error.message || 'company not stored',
        });
    }
};




//company_login
// const company_login = async (req, res, next) => {
//     try {
//         const { emailid, password } = req.body;

//         // Check if email and password are provided
//         if (!emailid || !password) {
//             return res.status(400).json({ success: false, message: 'Email and password are required' });
//         }

//         // Find the user with the provided email
//         const user = await Company.findOne({ emailid });

//         const findLogo = await CompanyOtherInfo.findOne({ company_id: user._id })


//         const logo = BASE_URL + findLogo.logo

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'Email Is Incurrect' });
//         }

//         // Compare the provided password with the hashed password stored in the database
//         // const passwordMatch = await bcrypt.compare(password, user.password);

//         // If passwords match, generate JWT token containing the company ID and return a successful login response with user data and token
//         if (password === user.password) {
//             const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

//             if (!accessTokenSecret) {
//                 throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
//             }

//             // Create token payload specific to the user
//             const tokenPayload = {
//                 companyId: user._id, // Include the company ID in the token payload
//                 emailid: user.emailid,
//                 company_name: user.company_name,
//                 logo: logo,
//                 role: 'company' // Assign role based on the user type
//                 // Add other user data fields as needed
//             };

//             // Sign token with access token secret
//             const token = jwt.sign(tokenPayload, accessTokenSecret);

//             const notificationData = await Notification.create({
//                 company_id: user._id,
//                 title: "Welcome",
//                 message: "welcome to Chembizz",
//             })

//             const adminSocketId = getReceiverSocketId(user._id); // Implement this function to get the admin's socket ID
//             if (adminSocketId) {
//                 io.to(adminSocketId).emit('newNotification', notificationData);
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: 'Login is successful',
//                 user: {
//                     _id: user._id,
//                     emailid: user.emailid,
//                     company_name: user.company_name,
//                     // Add other user data fields as needed
//                 },
//                 token: token
//             });
//         } else {
//             // If passwords do not match, return a 401 unauthorized error
//             return res.status(401).json({ success: false, message: 'Password does not match' });
//         }


//         // const logo = BASE_URL + findLogo.logo

//         // console.log("logo:", logo)

//         // // If the user is not found, return a 404 error
//         // if (!user) {
//         //     return res.status(404).json({ success: false, message: 'Email Is Incurrect' });
//         // }

//         // // Compare the provided password with the hashed password stored in the database
//         // // const passwordMatch = await bcrypt.compare(password, user.password);

//         // // If passwords match, generate JWT token containing the company ID and return a successful login response with user data and token
//         // if (password === user.password) {
//         //     const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

//         //     if (!accessTokenSecret) {
//         //         throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
//         //     }

//         //     // Create token payload specific to the user
//         //     const tokenPayload = {
//         //         companyId: user._id, // Include the company ID in the token payload
//         //         emailid: user.emailid,
//         //         company_name: user.company_name,
//         //         logo: logo,
//         //         role: 'company' // Assign role based on the user type
//         //         // Add other user data fields as needed
//         //     };

//         //     // Sign token with access token secret
//         //     const token = jwt.sign(tokenPayload, accessTokenSecret);

//         //     const notificationData = await Notification.create({
//         //         company_id: user._id,
//         //         title: "Welcome",
//         //         message: "welcome to Chembizz",
//         //     })

//         //     const adminSocketId = getReceiverSocketId(user._id); // Implement this function to get the admin's socket ID
//         //     if (adminSocketId) {
//         //         io.to(adminSocketId).emit('newNotification', notificationData);
//         //     }

//         //     return res.status(200).json({
//         //         success: true,
//         //         message: 'Login is successful',
//         //         user: {
//         //             _id: user._id,
//         //             emailid: user.emailid,
//         //             company_name: user.company_name,
//         //             // Add other user data fields as needed
//         //         },
//         //         token: token
//         //     });
//         // } else {
//         //     // If passwords do not match, return a 401 unauthorized error
//         //     return res.status(401).json({ success: false, message: 'Password does not match' });
//         // }
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };


const company_login = async (req, res, next) => {
    try {
        const { emailid, password } = req.body;

        // Check if email and password are provided
        if (!emailid || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find the user with the provided email
        const user = await Company.findOne({ emailid });

        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email is incorrect' });
        }

        // Compare the provided password with the stored password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Find the package booking data for the company
            const package_booking_data = await package_booking.findOne({ company_id: user._id });

            let membership_package;
            if (package_booking_data) {
                // If booking data exists, find the membership package
                membership_package = await membership_plan_schema.findOne({ _id: package_booking_data.plan_id });
            } else {
                // If no booking data exists, set membership_package to null or a default object
                membership_package = null;
            }

            // Find the company logo after successful login
            const findLogo = await CompanyOtherInfo.findOne({ company_id: user._id });
            const logo = findLogo ? Azure_Storage_Base_Url + findLogo.logo : '';

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!accessTokenSecret) {
                throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
            }

            // Create token payload specific to the user
            const tokenPayload = {
                companyId: user._id,
                emailid: user.emailid,
                company_name: user.company_name,
                logo: logo,
                role: 'company'
            };

            // Sign token with access token secret
            const token = jwt.sign(tokenPayload, accessTokenSecret);

            const notificationData = await Notification.create({
                company_id: user._id,
                title: "Welcome",
                message: "Welcome to Chembizz",
            });

            const adminSocketId = getReceiverSocketId(user._id);
            if (adminSocketId) {
                io.to(adminSocketId).emit('newNotification', notificationData);
            }

            return res.status(200).json({
                success: true,
                message: 'Login is successful',
                user: {
                    _id: user._id,
                    emailid: user.emailid,
                    company_name: user.company_name,
                    membership_status: user.membership_status,
                    plan_selling_price: membership_package ? membership_package.plan_selling_price : null,
                    plan_original_price: membership_package ? membership_package.plan_original_price : null,
                    catalog_limit: membership_package ? membership_package.catalog_limit : null,
                    plan_name: membership_package ? membership_package.plan_name : null,
                    plan_days: membership_package ? membership_package.plan_days : null,
                    booking_date: package_booking_data ? package_booking_data.booking_date : null
                },
                token: token
            });
        } else {
            // If passwords do not match, return a 401 unauthorized error
            return res.status(401).json({ success: false, message: 'Password does not match' });
        }
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};







// Define function to change password
const changePassword = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const { emailid, oldPassword, newPassword } = req.body;

        // Check if email, old password, and new password are provided
        if (!emailid || !oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, old password, and new password are required' });
        }

        // Find the user with the provided email
        const user = await Company.findOne({ emailid: emailid });

        // If the user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the provided old password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        // If old password matches, update the password with the new one
        if (passwordMatch) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();
            return res.status(200).json({ success: true, message: 'Password changed successfully', user });
        } else {
            // If old password does not match, return a 401 unauthorized error
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Define function to edit profile
// const editProfile = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }
//         const { id } = req.params; // Assuming the ID is passed in the URL parameters


//         // Find the user with the provided ID
//         let user = await Company.findById(id);

//         // If the user is not found, return a 404 error
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Update user's profile information with the provided data
//         Object.assign(user, req.body);
//         await user.save();

//         // Return the updated user profile
//         return res.status(200).json({ success: true, message: 'Profile updated successfully', user });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

const editProfile = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        const { id } = req.params; // Assuming the ID is passed in the URL parameters

        let {
            company_name, gst, contact_person_name, mobile_num, emailid, mode_of_business, country, state, city, pincode
        } = req.body

        const existOtherInfoDetailsCheckEmail = await CompanyOtherInfo.findOne({ other_emailid: emailid });
        if (existOtherInfoDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in other information"
            });
        }

        const existOtherInfoDetailsCheckMobile = await CompanyOtherInfo.findOne({ other_contactno: mobile_num });
        if (existOtherInfoDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in other information"
            });
        }

        if (emailid) {
            const existingCompanyWithEmail = await Company.findOne({ emailid });
            if (existingCompanyWithEmail && existingCompanyWithEmail._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this email already exists' });
            }
        }

        if (mobile_num) {
            const existingCompanyWithMobile = await Company.findOne({ mobile_num });
            if (existingCompanyWithMobile && existingCompanyWithMobile._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this mobile number already exists' });
            }
        }

        if (gst) {
            const existingCompanyWithGst = await Company.findOne({ gst });
            if (existingCompanyWithGst && existingCompanyWithGst._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this GST number already exists' });
            }
        }

        let companyUpdateData = await Company.findByIdAndUpdate(id, req.body, { new: true })

        // Find the user with the provided ID

        // Return the updated user profile
        return res.status(200).json({ success: true, message: 'Profile updated successfully', data: companyUpdateData });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Define function to display company details
const displayCompanyDetails = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        // Use the aggregation framework to join company details with other info
        const companyDetails = await Company.aggregate([
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    company_name: 1,
                    gst: 1,
                    contact_person_name: 1,
                    address: 1,
                    mobile_num: 1,
                    landline_num: 1,
                    emailid: 1,
                    mode_of_business: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    status: 1,
                    membership_status: 1,
                    pincode: 1,
                    'other_info._id': 1,
                    'other_info.logo': 1,
                    'other_info.website': 1,
                    'other_info.other_emailid': 1,
                    'other_info.other_contactno': 1,
                    'other_info.fb': 1,
                    'other_info.insta': 1,
                    'other_info.twitter': 1,
                    'other_info.linkedin': 1,
                    'other_info.createdAt': 1,
                    'other_info.updatedAt': 1
                }
            }
        ]);

        if (!companyDetails || companyDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'No company details found or no associated other info' });
        }

        companyDetails.forEach(company => {
            if (company.other_info && company.other_info.length > 0) {
                company.other_info.forEach(company => {
                    if (company.logo) {
                        company.logo = `${Azure_Storage_Base_Url}${company.logo}`;
                    }
                });
            }
        });
        // Return the combined company details with other information
        return res.status(200).json({ success: true, message: 'Company details with other info retrieved successfully', companyDetails });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


////////////////////////////////////////////////////////////////
// Define updateStatus function
// Define updateStatus function
const updateStatus = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        // Ensure that required fields are present in the request body
        if (!req.body.company_id || !req.body.status) {
            return res.status(400).json({ message: 'Company ID and status are required' });
        }

        // Find the company by ID
        const company = await Company.findById(req.body.company_id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Update the status
        company.status = req.body.status;
        company.updatedAt = Date.now(); // Update the updatedAt field
        await company.save();

        res.status(200).json({
            success: true,
            message: 'Company status updated successfully',
            company: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Failed to update company status',
        });
    }
};


const displayAllCompanies = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to add inquiry if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }
        // Fetch all company data from the database
        const allCompanies = await Company.find({}, '-password');

        // Check if any companies are found
        if (!allCompanies || allCompanies.length === 0) {
            return res.status(404).json({ success: false, message: 'no companies found' });
        }

        // Return the list of companies as a successful response
        return res.status(200).json({ success: true, message: 'companies found', companies: allCompanies });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};


////////////////////

// const displayCompanyDetail = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Extract company ID from request parameters or JWT token, depending on your authentication mechanism
//         const companyId = req.params.companyId; // Assuming companyId is passed as a parameter

//         // Aggregate pipeline to retrieve company details along with related information
//         const companyDetails = await Company.aggregate([
//             // Match documents by company ID
//             { $match: { _id: new mongoose.Types.ObjectId(companyId) } }, // Match the inquiry by its ID

//             // Lookup to fetch employee details
//             {
//                 $lookup: {
//                     from: 'employees',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'employee_details'
//                 }
//             },

//             // Lookup to fetch certificates associated with the company
//             {
//                 $lookup: {
//                     from: 'certificates',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//                     ],
//                     as: 'certificates'
//                 }
//             },

//             // Lookup to fetch documents associated with the company
//             {
//                 $lookup: {
//                     from: 'documents',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//                     ],
//                     as: 'documents'
//                 }
//             },

//             // Lookup to fetch catalogs associated with the company
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } },
//                         { $count: 'total_catalogs' } // Count total catalogs
//                     ],
//                     as: 'catalogs'
//                 }
//             },

//             // Lookup to fetch total buying inquiries for the company
//             {
//                 $lookup: {
//                     from: 'inquiries',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $and: [{ $eq: ['$inquiry_company_id', '$$companyId'] }, { $eq: ['$inq_type', 'buying'] }] } } },
//                         { $count: 'total_buying_inquiries' } // Count total buying inquiries
//                     ],
//                     as: 'buying_inquiries'
//                 }
//             },

//             // Projection stage to shape the output
//             {
//                 $project: {
//                     _id: 1,
//                     company_name: 1,
//                     gst: 1,
//                     contact_person_name: 1,
//                     address: 1,
//                     mobile_num: 1,
//                     emailid: 1,
//                     country: 1,
//                     state: 1,
//                     city: 1,
//                     pincode: 1,
//                     status: 1,
//                     createdAt: 1,
//                     updatedAt: 1,
//                     employee_details: 1,
//                     certificates: 1,
//                     documents: 1,
//                     total_catalogs: { $arrayElemAt: ['$catalogs.total_catalogs', 0] }, // Extract total catalogs count
//                     total_buying_inquiries: { $arrayElemAt: ['$buying_inquiries.total_buying_inquiries', 0] }, // Extract total buying inquiries count
//                     'catalog.packaging_size': 1,
//                     'catalog.packaging_type': 1,
//                     'catalog.storage': 1,
//                     'catalog.price_min': 1,
//                     'catalog.price_max': 1,
//                     'catalog.qty': 1,
//                     'catalog.qty_type': 1,
//                     'product_details.CAS_number': 1,
//                     'product_details.name_of_chemical': 1,
//                     'product_details.structure': 1,
//                     'product_details.HSN_code': 1,
//                     'product_details.molecularFormula': 1,
//                     'product_details.mol_weight': 1,
//                     'product_details.synonums': 1,
//                     'product_details.applicationUses': 1,
//                     'product_details.remarks': 1,
//                     'product_details.status': 1,
//                     'company.company_name': 1,
//                     'company.gst': 1,
//                     'company.contact_person_name': 1,
//                     'company.address': 1,
//                     'company.mobile_num': 1,
//                     'company.emailid': 1,
//                     'company.country': 1,
//                     'company.state': 1,
//                     'company.city': 1,
//                     'company.pincode': 1,
//                     'company.status': 1,
//                     inquiry_qty: 1,
//                     tentative_dispatch_date: 1,
//                     inq_type: 1,
//                     createdAt: 1,
//                     updatedAt: 1,

//                 }
//             }
//         ]);

//         // Check if company details exist
//         if (companyDetails.length === 0) {
//             return res.status(404).json({ success: false, message: 'Company not found' });
//         }

//         // Send success response with company details
//         return res.status(200).json({
//             success: true,
//             message: 'Company details retrieved successfully',
//             company: companyDetails[0]
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

// /////////////////////////////////////////
// const displayCompanyDetail = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }

//         // Proceed to add inquiry if the user has the required role
//         // Check if the user's role is 'superadmin', 'admin', or 'company'
//         if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'unauthorized access' });
//         }
//         // Extract company ID from request parameters
//         const companyId = req.params.companyId;

//         // Aggregate pipeline to retrieve company details along with related information
//         const companyDetails = await Company.aggregate([
//             // Match documents by company ID
//             { $match: { _id: new mongoose.Types.ObjectId(companyId) } },

//             // Lookup to fetch employee details
//             {
//                 $lookup: {
//                     from: 'employees',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'employee_details'
//                 }
//             },

//             // // Lookup to fetch certificates associated with the company
//             // {
//             //     $lookup: {
//             //         from: 'certificates',
//             //         let: { companyId: '$_id' },
//             //         pipeline: [
//             //             { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//             //         ],
//             //         as: 'certificates'
//             //     }
//             // },



//             // // Lookup to fetch documents associated with the company and change document status
//             // {
//             //     $lookup: {
//             //         from: 'documents',
//             //         let: { companyId: '$_id' },
//             //         pipeline: [
//             //             { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } },
//             //             // { $set: { status: 'changed status' } } // Change document status
//             //         ],
//             //         as: 'documents'
//             //     }
//             // },

//             // Lookup to fetch documents associated with the company and update document status
//             {
//                 $lookup: {
//                     from: 'documents',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } },
//                         {
//                             $lookup: {
//                                 from: 'certificates',
//                                 localField: 'certificate_id',
//                                 foreignField: '_id',
//                                 as: 'certificate'
//                             }
//                         },
//                         // { $set: { 'certificate.status': 'changed status' } } // Change certificate status
//                     ],
//                     as: 'documents'
//                 }
//             },

//             // Lookup to fetch catalogs associated with the company
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//                     ],
//                     as: 'catalogs'
//                 }
//             },

//             // Lookup to fetch total buying inquiries for the company
//             {
//                 $lookup: {
//                     from: 'inquiries',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $and: [{ $eq: ['$inquiry_company_id', '$$companyId'] }, { $eq: ['$inq_type', 'buying'] }] } } }
//                     ],
//                     as: 'buying_inquiries'
//                 }
//             },

//             {
//                 $lookup: {
//                     from: 'inquiries',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $and: [{ $eq: ['$inquiry_company_id', '$$companyId'] }, { $eq: ['$inq_type', 'selling'] }] } } }
//                     ],
//                     as: 'selling_inquiries'
//                 }
//             },

//             // Projection stage to shape the output
//             {
//                 $project: {
//                     _id: 1,
//                     company_name: 1,
//                     gst: 1,
//                     contact_person_name: 1,
//                     address: 1,
//                     mobile_num: 1,
//                     emailid: 1,
//                     country: 1,
//                     state: 1,
//                     city: 1,
//                     pincode: 1,
//                     status: 1,
//                     createdAt: 1,
//                     updatedAt: 1,
//                     employee_details: 1,
//                     certificates: 1,
//                     documents: 1,
//                     catalogs: 1,
//                     total_buying_inquiries: { $size: '$buying_inquiries' }, // Count total buying inquiries
//                     total_selling_inquiries: { $size: '$selling_inquiries' }, // Count total buying inquiries

//                 }
//             }
//         ]);

//         // Check if company details exist
//         if (companyDetails.length === 0) {
//             return res.status(404).json({ success: false, message: 'Company not found' });
//         }

//         // Send success response with company details
//         return res.status(200).json({
//             success: true,
//             message: 'Company details retrieved successfully',
//             company: companyDetails[0]
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

// const displayCompanyDetail = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Proceed if the user has the required role ('superadmin', 'admin', or 'company')
//         if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         let companyId;
//         // If the user's role is 'company', use its companyId, else extract from request params
//         if (decodedToken.role === 'company') {
//             companyId = decodedToken.companyId;
//         } else {
//             companyId = req.params.companyId;
//         }

//         // Aggregate pipeline to retrieve company details along with related information
//         const companyDetails = await Company.aggregate([
//             // Match documents by company ID
//             { $match: { _id: new mongoose.Types.ObjectId(companyId) } },

//             // Lookup to fetch employee details
//             {
//                 $lookup: {
//                     from: 'employees',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'employee_details'
//                 }
//             },

//             // Lookup to fetch company other information
//             {
//                 $lookup: {
//                     from: 'companyotherinfos',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'other_info'
//                 }
//             },

//             // Lookup to fetch documents associated with the company
//             {
//                 $lookup: {
//                     from: 'documents',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//                     ],
//                     as: 'documents'
//                 }
//             },

//             // Lookup to fetch catalogs associated with the company
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     let: { companyId: '$_id' },
//                     pipeline: [
//                         { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
//                     ],
//                     as: 'catalogs'
//                 }
//             },

//             // // Unwind catalogs array
//             // { $unwind: "$catalogs" },

//             // Lookup to fetch product details from catalogs
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'catalogs.product_id',
//                     foreignField: '_id',
//                     as: 'products'
//                 }
//             },

//             // Lookup to fetch billing address
//             {
//                 $lookup: {
//                     from: 'billingaddresses',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'billing_address'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyaddresses',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'company_address'
//                 }
//             },
//             // Lookup to fetch bank details
//             {
//                 $lookup: {
//                     from: 'bankdetails',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'bank_details'
//                 }
//             },
//             {

//                 $lookup: {
//                     from: 'stamps',
//                     localField: '_id',
//                     foreignField: 'companyId',
//                     as: 'stamp_details'
//                 }
//             },
//             {

//                 $lookup: {
//                     from: 'bookings',
//                     localField: '_id',
//                     foreignField: 'companyId',
//                     as: 'booking_details'
//                 }
//             },
//             {

//                 $lookup: {
//                     from: 'bookings',
//                     localField: '_id',
//                     foreignField: 'companyId',
//                     as: 'membership_plans'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'membership_plans',
//                     localField: 'booking_details.packageId',
//                     foreignField: '_id',
//                     as: 'membership_plans'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'membership_plans',
//                     localField: 'booking_details.packageId',
//                     foreignField: '_id',
//                     as: 'membership_plans_deatils'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'membership_features',
//                     localField: 'membership_plans_deatils.membership_feature_id.membership_id',
//                     foreignField: '_id',
//                     as: 'membership_features'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'package_bookings',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'package_booking'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     company_name: 1,
//                     gst: 1,
//                     contact_person_name: 1,
//                     address: 1,
//                     mobile_num: 1,
//                     landline_num: 1,
//                     emailid: 1,
//                     mode_of_business: 1,
//                     membership_status: 1,
//                     country: 1,
//                     state: 1,
//                     city: 1,
//                     pincode: 1,
//                     status: 1,
//                     createdAt: 1,
//                     updatedAt: 1,
//                     employee_details: 1,
//                     documents: 1,
//                     catalogs: 1,
//                     products: 1,
//                     billing_address: 1,
//                     company_address: 1,
//                     bank_details: 1,
//                     stamp_details: 1,
//                     booking_details: 1,
//                     booking_details: 1,
//                     membership_plans: 1,
//                     membership_features: 1,
//                     package_booking: 1,
//                     other_info: { $arrayElemAt: ['$other_info', 0] } // Include company other info
//                 }
//             }
//         ]);

//         // Check if company details exist
//         if (companyDetails.length === 0) {
//             return res.status(404).json({ success: false, message: 'Company not found' });
//         }

//         // Send success response with company details
//         return res.status(200).json({
//             success: true,
//             message: 'Company details retrieved successfully',
//             company: companyDetails[0]
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

const displayCompanyDetail = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = verifyAccessToken(token);

        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        let companyId;
        if (decodedToken.role === 'company') {
            companyId = decodedToken.companyId;
        } else {
            companyId = req.params.companyId;
        }

        const companyDetails = await Company.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(companyId) } },
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'employee_details'
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $lookup: {
                    from: 'documents',
                    let: { companyId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } }
                    ],
                    as: 'documents'
                }
            },
            {
                $lookup: {
                    from: 'catalogs',
                    let: { companyId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$company_id', '$$companyId'] } } },
                        {
                            $lookup: {
                                from: 'products',
                                let: { productId: '$product_id' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$productId'] } } }
                                ],
                                as: 'product_details'
                            }
                        }
                    ],
                    as: 'catalogs'
                }
            },
            {
                $lookup: {
                    from: 'billingaddresses',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'billing_address'
                }
            },
            {
                $lookup: {
                    from: 'companyaddresses',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'company_address'
                }
            },
            {
                $lookup: {
                    from: 'bankdetails',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'bank_details'
                }
            },
            {
                $lookup: {
                    from: 'stamps',
                    localField: '_id',
                    foreignField: 'companyId',
                    as: 'stamp_details'
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'companyId',
                    as: 'booking_details'
                }
            },
            {
                $lookup: {
                    from: 'membership_plans',
                    localField: 'booking_details.packageId',
                    foreignField: '_id',
                    as: 'membership_plans'
                }
            },
            {
                $lookup: {
                    from: 'membership_plans',
                    localField: 'booking_details.packageId',
                    foreignField: '_id',
                    as: 'membership_plans_deatils'
                }
            },
            {
                $lookup: {
                    from: 'membership_features',
                    localField: 'membership_plans_deatils.membership_feature_id.membership_id',
                    foreignField: '_id',
                    as: 'membership_features'
                }
            },
            {
                $lookup: {
                    from: 'package_bookings',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'package_booking'
                }
            },
            {
                $lookup: {
                    from: 'inquiries',
                    localField: '_id',
                    foreignField: 'buyer_company_id',
                    as: 'buying_inquiry_details',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'seller_company_id',
                                foreignField: '_id',
                                as: 'seller_company_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'salesinvoices',
                                localField: '_id',
                                foreignField: 'inquiry_id',
                                as: 'salesInvoice_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'negotations',
                                localField: '_id',
                                foreignField: 'inquiryId',
                                as: 'negotations_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: 'product_id',
                                foreignField: '_id',
                                as: 'product_details'
                            }
                        },
                    ]
                }
            },
            {
                $lookup: {
                    from: 'inquiries',
                    localField: '_id',
                    foreignField: 'seller_company_id',
                    as: 'selling_inquiry_details',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'buyer_company_id',
                                foreignField: '_id',
                                as: 'buyer_company_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'salesinvoices',
                                localField: '_id',
                                foreignField: 'inquiry_id',
                                as: 'salesInvoice_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'negotations',
                                localField: '_id',
                                foreignField: 'inquiryId',
                                as: 'negotations_details'
                            }
                        },
                        {
                            $lookup: {
                                from: 'products',
                                localField: '_id',
                                foreignField: 'product_id',
                                as: 'product_details'
                            }
                        },
                    ]
                }
            },

            {
                $project: {
                    _id: 1,
                    company_name: 1,
                    gst: 1,
                    contact_person_name: 1,
                    address: 1,
                    mobile_num: 1,
                    landline_num: 1,
                    emailid: 1,
                    mode_of_business: 1,
                    membership_status: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    pincode: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    employee_details: 1,
                    documents: 1,
                    catalogs: 1,
                    billing_address: 1,
                    company_address: 1,
                    bank_details: 1,
                    stamp_details: 1,
                    booking_details: 1,
                    membership_plans: 1,
                    membership_features: 1,
                    package_booking: 1,
                    buying_inquiry_details: 1,
                    selling_inquiry_details: 1,
                    salesInvoice_details: 1,
                    other_info: { $arrayElemAt: ['$other_info', 0] }
                }
            }
        ]);

        if (companyDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }


        const addBaseUrlToImages = (items, fieldName, baseUrl) => {
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (item && item[fieldName]) {
                        item[fieldName] = baseUrl + item[fieldName];
                    }
                });
            }
        };

        const company = companyDetails[0];

        if (company.other_info) {
            addBaseUrlToImages([company.other_info], 'logo', Azure_Storage_Base_Url);
        }
        addBaseUrlToImages(company.documents, 'doc_file', Azure_Storage_Base_Url);
        addBaseUrlToImages(company.catalogs, 'COA', Azure_Storage_Base_Url);
        addBaseUrlToImages(company.bank_details, 'cancel_cheque_photo', Azure_Storage_Base_Url);
        addBaseUrlToImages(company.stamp_details, 'stampImage', Azure_Storage_Base_Url);
        addBaseUrlToImages(company.stamp_details, 'signImage', Azure_Storage_Base_Url);

        company.catalogs.forEach(catalog => {
            addBaseUrlToImages(catalog.product_details, 'structure', Azure_Storage_Base_Url);
        });

        return res.status(200).json({
            success: true,
            message: 'Company details retrieved successfully',
            company: company
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




//////////
// Function to display company by ID with billToAddress and shipToAddress
const displayCompanyById = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token
        const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

        // Check if the decoded token contains necessary information for verification
        if (!decodedToken || !decodedToken.role) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Proceed to display company if the user has the required role
        // Check if the user's role is 'superadmin', 'admin', or 'company'
        if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin' && decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Extract company ID from request parameters
        const companyId = req.params.id;

        // Aggregate query to fetch company data along with billToAddress and shipToAddress
        const companyData = await Company.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(companyId) } }, // Match the company ID
            {
                $lookup: { // Perform a left outer join with the "addresses" collection
                    from: "addresses",
                    let: { companyId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [ // Filter addresses where companyId matches the company ID
                                        { $eq: ["$companyId", "$$companyId"] },
                                        { $in: ["$addressType", ["bill_to", "ship_to"]] } // Include only bill_to and ship_to addresses
                                    ]
                                }
                            }
                        }
                    ],
                    as: "addresses" // Store the matching addresses in the "addresses" field
                }
            }
        ]);

        // Extract the first element from the array (since we are querying by company ID)
        const company = companyData[0];

        // Check if company with the given ID exists
        if (!company) {
            return res.status(404).json({ success: false, message: 'company not found' });
        }

        // Return the company information as a successful response
        return res.status(200).json({ success: true, message: 'company found', company: company });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};




////////////
const editCompanyProfileById = async (req, res, next) => {
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
        if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Extract company ID from request parameters
        const companyId = req.params.id;

        // Fetch company data from the database based on ID
        let company = await Company.findById(companyId);

        // Check if the company exists
        if (!company) {
            return res.status(404).json({ success: false, message: 'company not found' });
        }

        // Update company profile with the request body
        company = await Company.findByIdAndUpdate(companyId, req.body, { new: true });

        // Update or create bill_to_address if it exists in the request body
        if (req.body.bill_to_address) {
            await Address.findOneAndUpdate(
                { companyId: company._id, addressType: 'bill_to' },
                req.body.bill_to_address,
                { upsert: true }
            );
        }

        // Update or create ship_to_address if it exists in the request body
        if (req.body.ship_to_address) {
            await Address.findOneAndUpdate(
                { companyId: company._id, addressType: 'ship_to' },
                req.body.ship_to_address,
                { upsert: true }
            );
        }

        // Fetch the updated addresses
        const billToAddress = await Address.findOne({ companyId: company._id, addressType: 'bill_to' });
        const shipToAddress = await Address.findOne({ companyId: company._id, addressType: 'ship_to' });

        // Construct the response body
        const responseBody = {
            success: true,
            message: 'company profile updated successfully',
            company: company,
            bill_to_address: billToAddress,
            ship_to_address: shipToAddress
        };

        // Return the response
        return res.status(200).json(responseBody);
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};

const displayCompanyDetailsById = async (req, res, next) => {
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
        if (!['superadmin', 'admin', 'company'].includes(decodedToken.role)) {
            return res.status(403).json({ success: false, message: 'unauthorized access' });
        }

        // Extract company ID from token if the user role is 'company'
        const companyIdFromToken = decodedToken.role === 'company' ? decodedToken.company_id : null;

        // Extract company ID from request parameters
        const companyId = req.params.id;

        // Fetch company data from the database based on ID
        let company = null;

        // Check if the user is superadmin or admin, or if the company ID matches the token's company ID for a company role
        if (decodedToken.role === 'superadmin' || decodedToken.role === 'admin' || companyIdFromToken === companyId) {
            company = await Company.findById(companyId);
        } else {
            // If the user is a company and tries to access other company data, deny access
            return res.status(403).json({ success: false, message: 'unauthorized access - you can only access your own data' });
        }

        // Check if the company exists
        if (!company) {
            return res.status(404).json({ success: false, message: 'company not found' });
        }

        // Send the company details in the response
        return res.status(200).json({ success: true, message: 'company details retrieved successfully', company });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};

//

const forgotCompanyPassword = async (req, res, next) => {
    try {
        const { emailid, newPassword } = req.body;

        // Check if email is provided
        if (!emailid) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Find the company by email
        const company = await Company.findOne({ emailid });
        if (!company) {
            return res.status(404).json({ success: false, message: 'No company found with this email' });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        company.password = hashedPassword;
        await company.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        // If an error occurs, log it and pass it to the error handling middleware
        console.error('Error during password change:', error);
        next(error);
    }
};






////////////////////////////////////////////////////////////////////////////
//Company TOken start here


// Define function to change password
const changeCompanyPassword = async (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

        // Verify token (assuming verifyAccessToken is a function that verifies the token)
        const decodedToken = verifyAccessToken(token);

        // Check if the decoded token is null or undefined
        if (!decodedToken) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's role is 'company'
        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }

        const { oldPassword, newPassword } = req.body;

        // Check if old password and new password are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Old password and new password are required' });
        }

        // Find the company with the provided company ID from the token
        const company = await Company.findById(decodedToken.companyId);

        // If the company is not found, return a 404 error
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // if (oldPassword !== company.password) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Old password is not correct"
        //     })
        // }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // company.password = hashedPassword
        // await company.save()
        // res.status(200).json({
        //     success: true,
        //     message: "Password Change Successfully"
        // })
        // Compare the provided old password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(oldPassword, company.password);

        if (passwordMatch) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            company.password = hashedNewPassword;
            await company.save();
            return res.status(200).json({
                success: true,
                message: "Password Change Successfully"
            })
        } else {
            // If old password does not match, return a 401 unauthorized error
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Define function to edit profile
// const editCompanyProfile = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's company ID matches the requested company ID
//         // if (req.params.id) {
//         //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
//         // }

//         // Find the company with the provided ID
//         let company = await Company.findById(decodedToken.companyId); // Retrieve company using company ID from token

//         // If the company is not found, return a 404 error
//         if (!company) {
//             return res.status(404).json({ success: false, message: 'Company not found' });
//         }

//         // Update company's profile information with the provided data
//         Object.assign(company, req.body);
//         await company.save();

//         // Return the updated company profile
//         return res.status(200).json({ success: true, message: 'Profile updated successfully', company });
//     } catch (error) {
//         // Handle any unexpected errors and return a 500 internal server error
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

const editCompanyProfile = async (req, res, next) => {
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

        // const { id } = req.params; // Assuming the ID is passed in the URL parameters

        let company = await Company.findById(decodedToken.companyId)

        let {
            company_name, gst, contact_person_name, mobile_num, emailid, mode_of_business, country, state, city, pincode
        } = req.body

        const existOtherInfoDetailsCheckEmail = await CompanyOtherInfo.findOne({ other_emailid: emailid });
        if (existOtherInfoDetailsCheckEmail) {
            return res.status(400).json({
                success: false,
                message: "A company with this email already exists in other information"
            });
        }

        const existOtherInfoDetailsCheckMobile = await CompanyOtherInfo.findOne({ other_contactno: mobile_num });
        if (existOtherInfoDetailsCheckMobile) {
            return res.status(400).json({
                success: false,
                message: "A company with this mobile number already exists in other information"
            });
        }

        if (emailid) {
            const existingCompanyWithEmail = await Company.findOne({ emailid });
            if (existingCompanyWithEmail && existingCompanyWithEmail._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this email already exists' });
            }
        }

        if (mobile_num) {
            const existingCompanyWithMobile = await Company.findOne({ mobile_num });
            if (existingCompanyWithMobile && existingCompanyWithMobile._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this mobile number already exists' });
            }
        }

        if (gst) {
            const existingCompanyWithGst = await Company.findOne({ gst });
            if (existingCompanyWithGst && existingCompanyWithGst._id.toString() !== decodedToken.companyId) {
                return res.status(400).json({ success: false, message: 'A company with this GST number already exists' });
            }
        }

        let companyUpdateData = await Company.findByIdAndUpdate(company, req.body, { new: true })

        // Find the user with the provided ID

        // Return the updated user profile
        return res.status(200).json({ success: true, message: 'Profile updated successfully', data: companyUpdateData });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};





// Define function to display company details
const profile_display_with_other_info = async (req, res, next) => {
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

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }
        // Use the aggregation framework to join company details with other info
        const companyDetails = await Company.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match company ID from decoded token
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    company_name: 1,
                    gst: 1,
                    contact_person_name: 1,
                    address: 1,
                    mobile_num: 1,
                    landline_num: 1,
                    emailid: 1,
                    mode_of_business: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    status: 1,
                    pincode: 1,
                    membership_status: 1,
                    'other_info.banner':1,
                    'other_info._id': 1,
                    'other_info.logo': 1,
                    'other_info.website': 1,
                    'other_info.other_emailid': 1,
                    'other_info.other_contactno': 1,
                    'other_info.fb': 1,
                    'other_info.insta': 1,
                    'other_info.twitter': 1,
                    'other_info.linkedin': 1,
                    'other_info.createdAt': 1,
                    'other_info.updatedAt': 1
                }
            }
        ]);

        if (!companyDetails || companyDetails.length === 0) {
            return res.status(200).json({ success: false, message: 'No company details found or no associated other info' });
        }

        companyDetails.forEach(company => {
            if (company.other_info && company.other_info.length > 0) {
                company.other_info.forEach(company => {
                    if (company.logo) {
                        company.logo = `${Azure_Storage_Base_Url}${company.logo}`;
                    }
                    if(company.banner){
                        company.banner=`${Azure_Storage_Base_Url}${company.banner}`;
                    }
                });
            }
        });

        // Return the combined company details with other information
        return res.status(200).json({ success: true, message: 'Company details with other info retrieved successfully', companyDetails });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



////////////////////////////////////////////////////////////////
// const displayTotalSellingInquirys = async (req, res, next) => {
//     try {
//         // Extract token from request headers
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's company ID matches the requested company ID
//         // if (req.params.id && decodedToken.companyId !== req.params.id) {
//         //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
//         // }

//         // Perform aggregation to fetch selling inquiries with company information
//         const totalSellingInquiries = await Inquiry.aggregate([
//             {
//                 $match: {
//                     seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId), // Match company ID from decoded token
//                     inq_type: 'inquiry', // Filter by inquiry type
//                     // status: 'active' // Consider only active inquiries
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companies',
//                     localField: 'buyer_company_id',
//                     foreignField: '_id',
//                     as: 'buyer_company'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'product_id',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $group: {
//                     _id: null, // Group all documents
//                     total: { $sum: 1 }, // Calculate total count
//                     sellingInquiries: { $push: '$$ROOT' } // Store selling inquiries in an array
//                 }
//             }
//         ]);

//         // Check if total selling inquiries is empty
//         if (!totalSellingInquiries || totalSellingInquiries.length === 0) {
//             return res.status(200).json({ success: false, message: 'No selling inquiries available' });
//         }

//         // Send the full body response including selling inquiries and total count
//         return res.status(200).json({
//             success: true,
//             message: 'Total selling inquiries count retrieved successfully',
//             total: totalSellingInquiries[0].total,
//             sellingInquiries: totalSellingInquiries[0].sellingInquiries
//         });
//     } catch (error) {
//         // Handle any unexpected errors and return an appropriate response
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };


const displayTotalSellingInquirys = async (req, res, next) => {
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

        // Perform aggregation to fetch selling inquiries with company information
        const totalSellingInquiries = await Inquiry.aggregate([
            {
                $match: {
                    seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId), // Match company ID from decoded token
                    inq_type: 'commercial', // Filter by inquiry type
                    // status: 'active' // Consider only active inquiries
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        { $project: { password: 0 } } // Exclude password field
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    total: { $sum: 1 }, // Calculate total count
                    sellingInquiries: { $push: '$$ROOT' } // Store selling inquiries in an array
                }
            }
        ]);

        // Check if total selling inquiries is empty
        if (!totalSellingInquiries || totalSellingInquiries.length === 0) {
            return res.status(200).json({ success: false, message: 'No selling inquiries available' });
        }

        // Add base URLs to COA and structure fields
        const inquiries = totalSellingInquiries[0].sellingInquiries.map(inquiry => {
            if (inquiry.COA) {
                inquiry.COA = Azure_Storage_Base_Url + inquiry.COA;
            }
            if (inquiry.product && Array.isArray(inquiry.product)) {
                inquiry.product = inquiry.product.map(product => {
                    if (product.structure) {
                        product.structure = Azure_Storage_Base_Url + product.structure;
                    }
                    return product;
                });
            }
            return inquiry;
        });

        // Send the full body response including selling inquiries and total count
        return res.status(200).json({
            success: true,
            message: 'Total selling inquiries count retrieved successfully',
            total: totalSellingInquiries[0].total,
            sellingInquiries: inquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const displayTotalSellingSampleInquirys = async (req, res, next) => {
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

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id && decodedToken.companyId !== req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }
        // Perform aggregation to fetch selling sample inquiries with company information
        const totalSellingSampleInquiry = await Inquiry.aggregate([
            {
                $match: {
                    seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId), // Match company ID from decoded token
                    inq_type: 'sample inquiry', // Filter by sample inquiry type
                    // status: 'active' // Consider only active inquiries
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        { $project: { password: 0 } } // Exclude password field
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    total: { $sum: 1 }, // Calculate total count
                    sellingSampleInquiries: { $push: '$$ROOT' } // Store selling sample inquiries in an array
                }
            }
        ]);

        // Check if total selling sample inquiry is empty
        if (!totalSellingSampleInquiry || totalSellingSampleInquiry.length === 0) {
            return res.status(200).json({ success: false, message: 'no selling sample inquiries available' });
        }

        // Add base URLs to COA and structure fields
        const inquiries = totalSellingSampleInquiry[0].sellingSampleInquiries.map(inquiry => {
            if (inquiry.COA) {
                inquiry.COA = Azure_Storage_Base_Url + inquiry.COA;
            }
            if (inquiry.product && Array.isArray(inquiry.product)) {
                inquiry.product = inquiry.product.map(product => {
                    if (product.structure) {
                        product.structure = Azure_Storage_Base_Url + product.structure;
                    }
                    return product;
                });
            }
            return inquiry;
        });

        // Send the full body response including selling sample inquiries and total count
        return res.status(200).json({
            success: true,
            message: 'total selling sample inquiry count retrieved successfully',
            total: totalSellingSampleInquiry[0].total,
            sellingSampleInquiries: totalSellingSampleInquiry[0].sellingSampleInquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};


//

const displayTotalBuyingInquirys = async (req, res, next) => {
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

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id && decodedToken.companyId !== req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }
        // Perform aggregation to fetch buying inquiries with company information
        const totalBuyingInquiry = await Inquiry.aggregate([
            {
                $match: {
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId), // Match company ID from decoded token
                    inq_type: 'commercial', // Filter by inquiry type
                    // status: 'active', // Consider only active inquiries
                    // seller_company_id: { $exists: true } // Filter by seller company present
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        { $project: { password: 0 } } // Exclude password field
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    total: { $sum: 1 }, // Calculate total count
                    buyingInquiries: { $push: '$$ROOT' } // Store buying inquiries in an array
                }
            }
        ]);

        // Check if total buying inquiry is empty
        if (!totalBuyingInquiry || totalBuyingInquiry.length === 0) {
            return res.status(200).json({ success: false, message: 'no buying inquiries available' });
        }

        // Add base URLs to COA and structure fields
        const inquiries = totalBuyingInquiry[0].buyingInquiries.map(inquiry => {
            if (inquiry.COA) {
                inquiry.COA = Azure_Storage_Base_Url + inquiry.COA;
            }
            if (inquiry.product && Array.isArray(inquiry.product)) {
                inquiry.product = inquiry.product.map(product => {
                    if (product.structure) {
                        product.structure = Azure_Storage_Base_Url + product.structure;
                    }
                    return product;
                });
            }
            return inquiry;
        });

        // Send the full body response including buying inquiries and total count
        return res.status(200).json({
            success: true,
            message: 'total buying inquiry count retrieved successfully',
            total: totalBuyingInquiry[0].total,
            buyingInquiries: totalBuyingInquiry[0].buyingInquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};


//

const displayTotalBuyingSampleInquirys = async (req, res, next) => {
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

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id && decodedToken.companyId !== req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }
        // Perform aggregation to fetch buying sample inquiries with company information
        const totalBuyingSampleInquiry = await Inquiry.aggregate([
            {
                $match: {
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId), // Match company ID from decoded token
                    inq_type: 'sample inquiry', // Filter by sample inquiry type
                    // status: 'active', // Consider only active inquiries
                    // seller_company_id: { $exists: true } // Filter by seller company present
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        { $project: { password: 0 } } // Exclude password field
                    ]
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $group: {
                    _id: null, // Group all documents
                    total: { $sum: 1 }, // Calculate total count
                    buyingSampleInquiries: { $push: '$$ROOT' } // Store buying sample inquiries in an array
                }
            }
        ]);

        // Check if total buying sample inquiry is empty
        if (!totalBuyingSampleInquiry || totalBuyingSampleInquiry.length === 0) {
            return res.status(200).json({ success: false, message: 'no buying sample inquiries available' });
        }


        const inquiries = totalBuyingSampleInquiry[0].buyingSampleInquiries.map(inquiry => {
            if (inquiry.COA) {
                inquiry.COA = Azure_Storage_Base_Url + inquiry.COA;
            }
            if (inquiry.product && Array.isArray(inquiry.product)) {
                inquiry.product = inquiry.product.map(product => {
                    if (product.structure) {
                        product.structure = Azure_Storage_Base_Url + product.structure;
                    }
                    return product;
                });
            }
            return inquiry;
        });

        // Send the full body response including buying sample inquiries and total count
        return res.status(200).json({
            success: true,
            message: 'total buying sample inquiry count retrieved successfully',
            total: totalBuyingSampleInquiry[0].total,
            buyingSampleInquiries: totalBuyingSampleInquiry[0].buyingSampleInquiries
        });
    } catch (error) {
        // Handle any unexpected errors and return an appropriate response
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};



//


//////////
// Function to display company by ID with billToAddress and shipToAddress
const displayCompanysById = async (req, res, next) => {
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

        // Check if the user's company ID matches the requested company ID
        // if (req.params.id && decodedToken.companyId !== req.params.id) {
        //     return res.status(403).json({ success: false, message: 'Unauthorized access to this company profile' });
        // }

        // Extract company ID from request parameters
        const companyId = req.params.id;

        // Aggregate query to fetch company data along with billToAddress and shipToAddress
        const companyData = await Company.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(companyId) } }, // Match the company ID
            {
                $lookup: { // Perform a left outer join with the "addresses" collection
                    from: "addresses",
                    let: { companyId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [ // Filter addresses where companyId matches the company ID
                                        { $eq: ["$companyId", "$$companyId"] },
                                        { $in: ["$addressType", ["bill_to", "ship_to"]] } // Include only bill_to and ship_to addresses
                                    ]
                                }
                            }
                        },
                    ],
                    as: "addresses" // Store the matching addresses in the "addresses" field
                }
            },
            {
                $project: { // Exclude the password field
                    password: 0
                }
            }
        ]);

        // Extract the first element from the array (since we are querying by company ID)
        const company = companyData[0];

        // Check if company with the given ID exists
        if (!company) {
            return res.status(200).json({ success: false, message: 'company not available' });
        }

        // Return the company information as a successful response
        return res.status(200).json({ success: true, message: 'company found', company: company });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
};


// const compnayByIdToCatalogDetails = async (req, res) => {
//     try {

//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         let { companyId } = req.params

//         let displayData = await Company.aggregate([
//             {
//                 $match: { _id: new mongoose.Types.ObjectId(companyId) }
//             },

//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     localField: '_id', // Corrected localField
//                     foreignField: 'company_id',
//                     as: 'catalog' // Populate catalog details
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$catalog',
//                     preserveNullAndEmptyArrays: true // Agar katalog null ho ya khaali ho to bhi preserve karein
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyotherinfos',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'other_info'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$other_info',
//                     preserveNullAndEmptyArrays: true // Agar katalog null ho ya khaali ho to bhi preserve karein
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'catalog.product_id', // Corrected localField
//                     foreignField: '_id',
//                     as: 'product' // Populate catalog details
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$product',
//                     preserveNullAndEmptyArrays: true // Agar katalog null ho ya khaali ho to bhi preserve karein
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'documents',
//                     localField: '_id', // Corrected localField
//                     foreignField: 'company_id',
//                     as: 'documentDetails' // Populate catalog details
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     company_name: 1,
//                     gst: 1,
//                     contact_person_name: 1,
//                     address: 1,
//                     mobile_num: 1,
//                     landline_num: 1,
//                     emailid: 1,
//                     mode_of_business: 1,
//                     country: 1,
//                     state: 1,
//                     city: 1,
//                     status: 1,
//                     pincode: 1,
//                     membership_status: 1,
//                     'other_info._id': 1,
//                     'other_info.logo': 1,
//                     'other_info.website': 1,
//                     'other_info.other_emailid': 1,
//                     'other_info.other_contactno': 1,
//                     'other_info.fb': 1,
//                     'other_info.insta': 1,
//                     'other_info.twitter': 1,
//                     'other_info.linkedin': 1,
//                     'other_info.createdAt': 1,
//                     'other_info.updatedAt': 1,
//                     'catalog._id': 1,
//                     'catalog.company_id': 1,
//                     'catalog.product_id': 1,
//                     'catalog.category': 1,
//                     'catalog.subcategory': 1,
//                     'catalog.grade': 1,
//                     'catalog.COA': 1,
//                     'catalog.min_price': 1,
//                     'catalog.max_price': 1,
//                     'catalog.qty': 1,
//                     'catalog.qty_type': 1,
//                     'catalog.country_origin': 1,
//                     'catalog.supply_capacity': 1,
//                     'catalog.purity': 1,
//                     'catalog.one_lot_qty': 1,
//                     'catalog.one_lot_qty_type': 1,
//                     'catalog.one_lot_qty_price': 1,
//                     'catalog.max_lot_qty': 1,
//                     'catalog.createdAt': 1,
//                     'catalog.updatedAt': 1,
//                     'product.CAS_number': 1,
//                     'product.name_of_chemical': 1,
//                     'product.structure': 1,
//                     'product.molecularFormula': 1,
//                     'product.mol_weight': 1,
//                     'product.synonums': 1,
//                     'product.status': 1,
//                     'product.IUPAC_name': 1,
//                     'product.Appearance': 1,
//                     'product.storage': 1,
//                     documentDetails: 1,

//                 }
//             }

//         ]);

//         if (!displayData) {
//             return res.status(200).json({ success: false, message: 'company not available' });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Compnay By Catalog Find Successfully",
//             data: displayData
//         })

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'server error', error: error.message });
//     }
// }



// const compnayByIdToCatalogDetails = async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         let { companyId } = req.params

//         let displayData = await Company.aggregate([
//             {
//                 $match: { _id: new mongoose.Types.ObjectId(companyId) }
//             },
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'catalog'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$catalog',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyotherinfos',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'other_info'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$other_info',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'catalog.product_id',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$product',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'documents',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'documentDetails'
//                 }
//             },
//             {
//                 $project: {
//                     // _id: 1,
//                     // company_name: 1,
//                     // gst: 1,
//                     // contact_person_name: 1,
//                     // address: 1,
//                     // mobile_num: 1,
//                     // landline_num: 1,
//                     // emailid: 1,
//                     // mode_of_business: 1,
//                     // country: 1,
//                     // state: 1,
//                     // city: 1,
//                     // status: 1,
//                     // pincode: 1,
//                     // membership_status: 1,
//                     company_info: {
//                         _id: 1,
//                         company_name: 1,
//                         gst: 1,
//                         contact_person_name: 1,
//                         address: 1,
//                         mobile_num: 1,
//                         landline_num: 1,
//                         emailid: 1,
//                         mode_of_business: 1,
//                         country: 1,
//                         state: 1,
//                         city: 1,
//                         status: 1,
//                         pincode: 1,
//                         membership_status: 1
//                     },
//                     other_info: { $ifNull: ['$other_info', []] },
//                     catalog: {
//                         $cond: {
//                             if: { $eq: ["$catalog.active_chemicals", "active"] },
//                             then: "$catalog",
//                             else: []
//                         }
//                     },
//                     product: { $ifNull: ['$product', []] },
//                     documentDetails: { $ifNull: ['$documentDetails', []] },
//                 }
//             }
//         ]);

//         if (!displayData || displayData.length === 0) {
//             return res.status(200).json({ success: false, message: 'Company not available' });
//         }


//         const addBaseUrlToFields = (items, fields, baseUrl) => {
//             if (Array.isArray(items)) {
//                 items.forEach(item => {
//                     fields.forEach(field => {
//                         if (item[field]) {
//                             item[field] = baseUrl + item[field];
//                         }
//                     });
//                 });
//             }
//         };

//         displayData.forEach(company => {
//             addBaseUrlToFields([company.other_info], ['logo'], baseUrls.other_info);
//             addBaseUrlToFields([company.catalog], ['COA'], baseUrls.catalogs);
//             addBaseUrlToFields([company.product], ['structure'], baseUrls.product_details);
//             addBaseUrlToFields(company.documentDetails, ['doc_file'], baseUrls.document_details);
//         });


//         res.status(200).json({
//             success: true,
//             message: "Company By Catalog Find Successfully",
//             data: displayData
//         })

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// }



// const compnayByIdToCatalogDetails = async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//         // Verify token
//         const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

//         // Check if the decoded token contains necessary information for verification
//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Check if the user's role is 'company'
//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         let { companyId } = req.params;

//         let displayData = await Company.aggregate([
//             {
//                 $match: { _id: new mongoose.Types.ObjectId(companyId) }
//             },
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'catalog'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$catalog',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyotherinfos',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'other_info'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$other_info',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'catalog.product_id',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$product',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'documents',
//                     localField: '_id',
//                     foreignField: 'company_id',
//                     as: 'documentDetails'
//                 }
//             },
//             {
//                 $project: {
//                     company_info: {
//                         _id: '$_id',
//                         company_name: '$company_name',
//                         gst: '$gst',
//                         contact_person_name: '$contact_person_name',
//                         address: '$address',
//                         mobile_num: '$mobile_num',
//                         landline_num: '$landline_num',
//                         emailid: '$emailid',
//                         mode_of_business: '$mode_of_business',
//                         country: '$country',
//                         state: '$state',
//                         city: '$city',
//                         status: '$status',
//                         pincode: '$pincode',
//                         membership_status: '$membership_status'
//                     },
//                     company_otherInfo: { $ifNull: ['$other_info', {}] },
//                     catalog: {
//                         $cond: {
//                             if: { $eq: ["$catalog.active_chemicals", "active"] },
//                             then: "$catalog",
//                             else: []
//                         }
//                     },
//                     product: { $ifNull: ['$product', []] },
//                     document_details: { $ifNull: ['$documentDetails', []] }
//                 }
//             }
//         ]);

//         if (!displayData || displayData.length === 0) {
//             return res.status(200).json({ success: false, message: 'Company not available' });
//         }



//         const addBaseUrlToFields = (items, fields, baseUrl) => {
//             if (Array.isArray(items)) {
//                 items.forEach(item => {
//                     fields.forEach(field => {
//                         if (item[field]) {
//                             item[field] = baseUrl + item[field];
//                         }
//                     });
//                 });
//             }
//         };

//         displayData.forEach(company => {
//             addBaseUrlToFields([company.company_otherInfo], ['logo'], baseUrls.other_info);
//             addBaseUrlToFields([company.catalog], ['COA'], baseUrls.catalogs);
//             addBaseUrlToFields([company.product], ['structure'], baseUrls.product_details);
//             addBaseUrlToFields(company.document_details, ['doc_file'], baseUrls.document_details);
//         });

//         res.status(200).json({
//             success: true,
//             message: "Company By Catalog Find Successfully",
//             data: displayData
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
// };

const compnayByIdToCatalogDetails = async (req, res) => {
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

        let { companyId } = req.params;

        let displayData = await Company.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(companyId) }
            },
            {
                $lookup: {
                    from: 'catalogs',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'catalog'
                }
            },
            {
                $unwind: {
                    path: '$catalog',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $unwind: {
                    path: '$other_info',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'documents',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'documentDetails'
                }
            },
            {
                $project: {
                    company_info: {
                        _id: '$_id',
                        company_name: '$company_name',
                        gst: '$gst',
                        contact_person_name: '$contact_person_name',
                        address: '$address',
                        mobile_num: '$mobile_num',
                        landline_num: '$landline_num',
                        emailid: '$emailid',
                        mode_of_business: '$mode_of_business',
                        country: '$country',
                        state: '$state',
                        city: '$city',
                        status: '$status',
                        pincode: '$pincode',
                        membership_status: '$membership_status'
                    },
                    company_otherInfo: { $ifNull: ['$other_info', {}] },
                    catalog: {
                        $cond: {
                            if: { $eq: ["$catalog.active_chemicals", "active"] },
                            then: "$catalog",
                            else: []
                        }
                    },
                    product: { $ifNull: ['$product', []] },
                    document_details: { $ifNull: ['$documentDetails', []] }
                }
            }
        ]);

        if (!displayData || displayData.length === 0) {
            return res.status(200).json({ success: false, message: 'Company not available' });
        }

        // Helper function to mask mobile number
        const maskMobileNumber = (mobile) => {
            return mobile ? mobile.substring(0, 4) + '*******' : '';
        };

        const maskLandlineNumber = (landline) => {
            return landline ? landline.substring(0, 4) + '*******' : '';
        };

        // Helper function to mask email
        const maskEmail = (email) => {
            const [localPart, domain] = email.split('@');
            if (localPart.length > 4) {
                return localPart.substring(0, 4) + '*****' + '@' + domain;
            }
            return email;
        };

        // Add base URLs and mask mobile number and email
      

        const addBaseUrlToFields = (items, fields, baseUrl) => {
            if (Array.isArray(items)) {
                items.forEach(item => {
                    fields.forEach(field => {
                        if (item[field]) {
                            item[field] = baseUrl + item[field];
                        }
                    });
                });
            }
        };

        displayData.forEach(company => {
            // Mask the mobile number and email before sending the response
            company.company_info.mobile_num = maskMobileNumber(company.company_info.mobile_num);
            company.company_info.emailid = maskEmail(company.company_info.emailid);
            company.company_info.landline_num = maskLandlineNumber(company.company_info.landline_num);

            addBaseUrlToFields([company.company_otherInfo], ['logo'], Azure_Storage_Base_Url);
            addBaseUrlToFields([company.catalog], ['COA'], Azure_Storage_Base_Url);
            addBaseUrlToFields([company.product], ['structure'], Azure_Storage_Base_Url);
            addBaseUrlToFields(company.document_details, ['doc_file'], Azure_Storage_Base_Url);
        });

        res.status(200).json({
            success: true,
            message: "Company By Catalog Find Successfully",
            data: displayData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



const companyDetailsInfo = async (req, res) => {
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
        const companyDetails = await Company.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match company ID from decoded token
                }
            },
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $lookup: {
                    from: 'catalogs',
                    localField: '_id', // Corrected localField
                    foreignField: 'company_id',
                    as: 'catalog' // Populate catalog details
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'catalog.product_id', // Corrected localField
                    foreignField: '_id',
                    as: 'product' // Populate catalog details
                }
            },
            {
                $project: {
                    _id: 1,
                    company_name: 1,
                    gst: 1,
                    contact_person_name: 1,
                    address: 1,
                    mobile_num: 1,
                    landline_num: 1,
                    emailid: 1,
                    mode_of_business: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    status: 1,
                    pincode: 1,
                    membership_status: 1,
                    'other_info._id': 1,
                    'other_info.logo': 1,
                    'other_info.website': 1,
                    'other_info.other_emailid': 1,
                    'other_info.other_contactno': 1,
                    'other_info.fb': 1,
                    'other_info.insta': 1,
                    'other_info.twitter': 1,
                    'other_info.linkedin': 1,
                    'other_info.createdAt': 1,
                    'other_info.updatedAt': 1,
                    'catalog._id': 1,
                    'catalog.company_id': 1,
                    'catalog.product_id': 1,
                    'catalog.category': 1,
                    'catalog.subcategory': 1,
                    'catalog.grade': 1,
                    'catalog.COA': 1,
                    'catalog.min_price': 1,
                    'catalog.max_price': 1,
                    'catalog.qty': 1,
                    'catalog.qty_type': 1,
                    'catalog.country_origin': 1,
                    'catalog.supply_capacity': 1,
                    'catalog.purity': 1,
                    'catalog.one_lot_qty': 1,
                    'catalog.one_lot_qty_type': 1,
                    'catalog.one_lot_qty_price': 1,
                    'catalog.max_lot_qty': 1,
                    'catalog.createdAt': 1,
                    'catalog.updatedAt': 1,
                    'product.CAS_number': 1,
                    'product.name_of_chemical': 1,
                    'product.structure': 1,
                    'product.molecularFormula': 1,
                    'product.mol_weight': 1,
                    'product.synonums': 1,
                    'product.status': 1,
                    'product.IUPAC_name': 1,
                    'product.Appearance': 1,
                    'product.storage': 1
                }
            }
        ]);
        if (!companyDetails || companyDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: "companyDetails Not available",
                data: []
            });
        }

      

        const addBaseUrlToFields = (items, fields, baseUrl) => {
            if (Array.isArray(items)) {
                items.forEach(item => {
                    fields.forEach(field => {
                        if (item[field]) {
                            item[field] = baseUrl + item[field];
                        }
                    });
                });
            }
        };

        const company = companyDetails[0];

        addBaseUrlToFields(company.other_info, ['logo'], Azure_Storage_Base_Url);
        addBaseUrlToFields(company.catalog, ['COA'], Azure_Storage_Base_Url);
        addBaseUrlToFields(company.product, ['structure'], Azure_Storage_Base_Url);

        res.status(200).json({
            success: true,
            message: "Company Details Found Successfully",
            data: companyDetails
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 internal server error
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}

const displayEmailList = async (req, res) => {
    try {
        let emailList = await Company.aggregate([
            {
                $project: {
                    emailid: 1
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Email Find Successfully",
            data: emailList
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'server error', error: error.message });
    }
}


const companyLogoDetailsDisplay = async (req, res) => {
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
        const companyDetails = await Company.aggregate([
            {
                $lookup: {
                    from: 'companyotherinfos',
                    localField: '_id',
                    foreignField: 'company_id',
                    as: 'other_info'
                }
            },
            {
                $project: {
                    _id: 1,
                    company_name: 1,
                    'other_info.logo': 1,
                }
            }
        ]);

        if (!companyDetails || companyDetails.length === 0) {
            return res.status(200).json({
                success: false,
                message: "companyDetails Not available",
                data: []
            });
        }

        companyDetails.forEach(company => {
            if (company.other_info && company.other_info.length > 0) {
                company.other_info.forEach(company => {
                    if (company.logo) {
                        company.logo = `${Azure_Storage_Base_Url}${company.logo}`;
                    }
                });
            }
        });

        res.status(200).json({
            success: true,
            message: "Company Details Find Successfully",
            data: companyDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// const BASE_URL = 'https://example.com/'; // Replace with your actual base URL




// const companyDashboard = async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         const decodedToken = verifyAccessToken(token);

//         if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         if (decodedToken.role !== 'company') {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         const companies = await Company.find().lean().select('-password');

//         const products = await Product.aggregate([
//             {
//                 $lookup: {
//                     from: 'catalogs',
//                     localField: '_id',
//                     foreignField: 'product_id',
//                     as: 'catalog'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     name_of_chemical: 1,
//                     CAS_number: 1,
//                     structure: 1,
//                     molecularFormula: 1,
//                     mol_weight: 1,
//                     synonums: 1,
//                     status: 1,
//                     IUPAC_name: 1,
//                     Appearance: 1,
//                     storage: 1,
//                     createdAt: 1,
//                     updatedAt: 1,
//                     catalog: {
//                         min_price: 1,
//                         max_price: 1
//                     }
//                 }
//             },
//             {
//                 $limit: 12
//             }
//         ]);

//         const updatedProducts = products.map(product => {
//             if (product.structure) {
//                 product.structure = `${baseURL}${product.structure}`;
//             }
//             return product;
//         });

//         const totalInquiries = await Inquiry.find().lean().countDocuments();

//         const companyCatalog = await Catalog.aggregate([
//             {
//                 $match: {
//                     company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
//                 }
//             }
//         ]);

//         const updatedCatalog = companyCatalog.map(catalog => {
//             if (catalog.COA) {
//                 catalog.COA = `${catalogURL}${catalog.COA}`;
//             }
//             return catalog;
//         });

//         // Aggregate commercial inquiries by month
//         const monthlyInquiries = await Inquiry.aggregate([
//             {
//                 $match: {
//                     inq_type: "commercial",
//                     seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $month: "$createdAt" },
//                     inquiries: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { "_id": 1 }
//             },
//             {
//                 $project: {
//                     month: "$_id",
//                     inquiries: 1,
//                     _id: 0
//                 }
//             }
//         ]);

//         // Map month numbers to names (optional)
//         const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//         const inquiryData = monthlyInquiries.map(data => ({
//             month: monthNames[data.month - 1],
//             inquiries: data.inquiries
//         }));

//         res.status(200).json({
//             success: true,
//             message: "Dashboard data retrieved successfully",
//             data: {
//                 companies,
//                 products: updatedProducts,
//                 totalInquiries,
//                 companyCatalog: updatedCatalog,
//                 inquiryData // Include monthly inquiry data in the response
//             }
//         });
//     } catch (error) {
//         console.error('Error retrieving dashboard data:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve dashboard data',
//             error: error.message
//         });
//     }
// };


const companyDashboard = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = verifyAccessToken(token);

        if (!decodedToken || !decodedToken.role || !decodedToken.companyId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }

        if (decodedToken.role !== 'company') {
            return res.status(403).json({ success: false, message: 'Unauthorized access' });
        }
        // getMonth() is 0-indexed, so add 1 for human-readable month

        const companies = await Company.find().lean().select('-password');

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'catalogs',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'catalog'
                }
            },
            {
                $match: {
                    'catalog.status': 'active'
                }
            },
            {
                $project: {
                    _id: 1,
                    name_of_chemical: 1,
                    CAS_number: 1,
                    structure: 1,
                    molecularFormula: 1,
                    mol_weight: 1,
                    synonums: 1,
                    status: 1,
                    IUPAC_name: 1,
                    Appearance: 1,
                    storage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    catalog: {
                        min_price: 1,
                        max_price: 1
                    }
                }
            },
            {
                $limit: 8
            }
        ]);

        const updatedProducts = products.map(product => {
            if (product.structure) {
                product.structure = `${Azure_Storage_Base_Url}${product.structure}`;
            }
            return product;
        });

        const totalInquiries = await Inquiry.find().lean().countDocuments();

        // const totalDealDoneInquiry = await Inquiry.find({ status: "deal done" })
        const totalDealDoneInquiry = await Inquiry.aggregate([
            {
                $match: {
                    $or: [
                        { seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) },
                        { buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) }
                    ],
                    status: 'deal done',
                    status: 'po',
                    status: 'invoice',
                    status: 'dispatch',
                    status: 'in transit',
                    status: 'delivered',
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'buyer_company_id',
                    foreignField: '_id',
                    as: 'buyer_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'seller_company_id',
                    foreignField: '_id',
                    as: 'seller_company',
                    pipeline: [
                        {
                            $project: {
                                password: 0 // Exclude the password field
                            }
                        }
                    ]
                }
            },
        ])

        const companyCatalog = await Catalog.aggregate([
            {
                $match: {
                    company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                }
            },

        ]);

        const updatedCatalog = companyCatalog.map(catalog => {
            if (catalog.COA) {
                catalog.COA = `${Azure_Storage_Base_Url}${catalog.COA}`;
            }
            return catalog;
        });

        // Define month names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Get the current date and calculate the last 6 months
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const currentMonth = now.getMonth() + 1;

        // Aggregate commercial inquiries by month, limited to the last 6 months
        const monthlyCommercialInquiries = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: "commercial",
                    seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregate sample inquiries by month, limited to the last 6 months
        const monthlySampleInquiries = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: "sample inquiry",
                    seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);


        // Count of commercial inquiries received today
        const totalReceivedCommercialInquiriesToday = await Inquiry.countDocuments({
            inq_type: "commercial",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        const totalReceivedCommercialInquiriesThisMonth = await Inquiry.countDocuments({
            inq_type: "commercial",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });

        const totalReceivedSampleInquiriesToday = await Inquiry.countDocuments({
            inq_type: "sample inquiry",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        // const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed, so add 1 for human-readable month
        const totalReceivedSampleInquiriesThisMonth = await Inquiry.countDocuments({
            inq_type: "sample inquiry",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });

        const totalSentCommercialInquiriesToday = await Inquiry.countDocuments({
            inq_type: "commercial",
            buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        const totalSentCommercialInquiriesThisMonth = await Inquiry.countDocuments({
            inq_type: "commercial",
            buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });

        const totalSentSampleInquiriesToday = await Inquiry.countDocuments({
            inq_type: "sample inquiry",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        // const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed, so add 1 for human-readable month
        const totalSentSampleInquiriesThisMonth = await Inquiry.countDocuments({
            inq_type: "sample inquiry",
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });


        const totalGenratedPoToday = await SalesInvoice.countDocuments({
            status: "generate",
            invoice_type: 'po',
            buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        // const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed, so add 1 for human-readable month
        const totalGenratedPoThisMonth = await SalesInvoice.countDocuments({
            status: "generate",
            invoice_type: 'po',
            buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });


        const totalGenratedInvoiceToday = await SalesInvoice.countDocuments({
            status: "generate",
            invoice_type: 'tax_invoice',
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] },  // Match year
                    { $eq: [{ $month: "$createdAt" }, now.getMonth() + 1] },  // Match month (getMonth() is 0-indexed)
                    { $eq: [{ $dayOfMonth: "$createdAt" }, now.getDate()] }  // Match day
                ]
            }
        });

        // Count of commercial inquiries received this month
        // const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed, so add 1 for human-readable month
        const totalGenratedInvoiceThisMonth = await SalesInvoice.countDocuments({
            status: "generate",
            invoice_type: 'tax_invoice',
            seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, currentMonth] }, // Check if the month matches the current month
                    { $eq: [{ $year: "$createdAt" }, now.getFullYear()] } // Check if the year matches the current year
                ]
            }
        });



        // Create an array for the last 6 months with default inquiries count 0
        const inquiryData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1; // Get month number (1-12)
            inquiryData.push({
                month: monthNames[month - 1],
                commercial_inquiries: 0,
                sample_inquiries: 0
            });
        }

        // Merge the actual commercial inquiry data with the default array
        monthlyCommercialInquiries.forEach(data => {
            const index = inquiryData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                inquiryData[index].commercial_inquiries = data.inquiries;
            }
        });

        // Merge the actual sample inquiry data with the default array
        monthlySampleInquiries.forEach(data => {
            const index = inquiryData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                inquiryData[index].sample_inquiries = data.inquiries;
            }
        });

        const monthlyBuyerCommercialInquiries = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: "commercial",
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregate sample inquiries by month, limited to the last 6 months
        const monthlyBuyerSampleInquiries = await Inquiry.aggregate([
            {
                $match: {
                    inq_type: "sample inquiry",
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);

        // Create an array for the last 6 months with default inquiries count 0
        const buyingInquiryData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1; // Get month number (1-12)
            buyingInquiryData.push({
                month: monthNames[month - 1],
                commercial_inquiries: 0,
                sample_inquiries: 0
            });
        }

        // Merge the actual commercial inquiry data with the default array
        monthlyBuyerCommercialInquiries.forEach(data => {
            const index = buyingInquiryData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                buyingInquiryData[index].commercial_inquiries = data.inquiries;
            }
        });

        // Merge the actual sample inquiry data with the default array
        monthlyBuyerSampleInquiries.forEach(data => {
            const index = inquiryData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                inquiryData[index].sample_inquiries = data.inquiries;
            }
        });


        const monthlyPo = await SalesInvoice.aggregate([
            {
                $match: {
                    invoice_type: 'po',
                    buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo },
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregate sample inquiries by month, limited to the last 6 months
        const monthlyInvoice = await SalesInvoice.aggregate([
            {
                $match: {
                    invoice_type: 'tax_invoice',
                    seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    inquiries: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $project: {
                    month: "$_id",
                    inquiries: 1,
                    _id: 0
                }
            }
        ]);


        // Create an array for the last 6 months with default inquiries count 0
        const slalesData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1; // Get month number (1-12)
            slalesData.push({
                month: monthNames[month - 1],
                po_date: 0,
                invoice_data: 0
            });
        }

        // Merge the actual commercial inquiry data with the default array
        monthlyPo.forEach(data => {
            const index = slalesData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                slalesData[index].po_date = data.inquiries;
            }
        });

        // Merge the actual sample inquiry data with the default array
        monthlyInvoice.forEach(data => {
            const index = slalesData.findIndex(item => item.month === monthNames[data.month - 1]);
            if (index !== -1) {
                slalesData[index].invoice_data = data.inquiries;
            }
        });

        const topInquiryDetails = await Inquiry.aggregate([
            {
                $facet: {
                    // Existing facets for inquiries
                    sellingCommercialInquiry: [
                        {
                            $match: {
                                seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                                inq_type: 'commercial'
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    sellingSampleInquiry: [
                        {
                            $match: {
                                seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                                inq_type: 'sample inquiry'
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    buyingCommercialInquiry: [
                        {
                            $match: {
                                buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                                inq_type: 'commercial'
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    buyingSampleInquiry: [
                        {
                            $match: {
                                buyer_company_id: new mongoose.Types.ObjectId(decodedToken.companyId),
                                inq_type: 'sample inquiry'
                            }
                        },
                        {
                            $count: "count"
                        }
                    ]
                }
            },
            // Lookup in the SalesInvoice schema for POs and Invoices
            {
                $lookup: {
                    from: "salesinvoices", // The SalesInvoice collection name (make sure it's correct)
                    let: { companyId: new mongoose.Types.ObjectId(decodedToken.companyId) },
                    pipeline: [
                        {
                            $facet: {
                                // Count POs (buyer_company_id matches companyId)
                                totalPO: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$buyer_company_id", "$$companyId"] },
                                            invoice_type: 'po'
                                        }
                                    },
                                    {
                                        $count: "count"
                                    }
                                ],
                                // Count Invoices (seller_company_id matches companyId)
                                totalInvoice: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$seller_company_id", "$$companyId"] },
                                            invoice_type: 'tax_invoice'
                                        }
                                    },
                                    {
                                        $count: "count"
                                    }
                                ]
                            }
                        }
                    ],
                    as: "salesInvoiceDetails"
                }
            },
            {
                $project: {
                    topInquiryDetails: [
                        {
                            label: "selling commercial inquiry",
                            count: { $ifNull: [{ $arrayElemAt: ["$sellingCommercialInquiry.count", 0] }, 0] },
                            outOf: 50
                        },
                        {
                            label: "selling sample inquiry",
                            count: { $ifNull: [{ $arrayElemAt: ["$sellingSampleInquiry.count", 0] }, 0] },
                            outOf: 50
                        },
                        {
                            label: "buying commercial inquiry",
                            count: { $ifNull: [{ $arrayElemAt: ["$buyingCommercialInquiry.count", 0] }, 0] },
                            outOf: 50
                        },
                        {
                            label: "buying sample inquiry",
                            count: { $ifNull: [{ $arrayElemAt: ["$buyingSampleInquiry.count", 0] }, 0] },
                            outOf: 50
                        },
                        // Use $arrayElemAt to extract the correct count for PO and Invoice
                        {
                            label: "po",
                            count: { $ifNull: [{ $arrayElemAt: [{ $arrayElemAt: ["$salesInvoiceDetails.totalPO.count", 0] }, 0] }, 0] },
                            outOf: 50
                        },
                        {
                            label: "invoice",
                            count: { $ifNull: [{ $arrayElemAt: [{ $arrayElemAt: ["$salesInvoiceDetails.totalInvoice.count", 0] }, 0] }, 0] },
                            outOf: 50
                        }
                    ]
                }
            }
        ]);

        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const pastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
        const pastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

        const catalogSellingInquiryCountArray = await Catalog.aggregate([
            {
                $match: {
                    company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match catalogs for the company
                }
            },
            {
                $lookup: {
                    from: "products", // Join with products to get product name
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: {
                    path: '$product', // Unwind products array
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "inquiries", // Join with inquiries to get inquiries related to the product
                    let: { productId: "$product._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$product_id", "$$productId"] }, // Match by product ID
                                seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId) // Match seller company
                            }
                        }
                    ],
                    as: "inquiries"
                }
            },
            {
                $addFields: {
                    // Add current month inquiry count by filtering inquiries within the current month date range
                    currentMonthSellingInquiry: {
                        $size: {
                            $filter: {
                                input: "$inquiries",
                                as: "inquiry",
                                cond: {
                                    $and: [
                                        { $gte: ["$$inquiry.createdAt", currentMonthStart] }, // Inquiry is in current month
                                        { $lt: ["$$inquiry.createdAt", currentMonthEnd] }
                                    ]
                                }
                            }
                        }
                    },
                    // Add past month inquiry count by filtering inquiries within the past month date range
                    pastMonthSellingInquiry: {
                        $size: {
                            $filter: {
                                input: "$inquiries",
                                as: "inquiry",
                                cond: {
                                    $and: [
                                        { $gte: ["$$inquiry.createdAt", pastMonthStart] }, // Inquiry is in past month
                                        { $lt: ["$$inquiry.createdAt", pastMonthEnd] }
                                    ]
                                }
                            }
                        }
                    },
                    selling_inquiry_count: { $size: "$inquiries" } // Total number of inquiries for the product
                }
            },
            {
                $project: {
                    _id: 0, // Do not include _id field
                    product: "$product.name_of_chemical", // Map product name
                    // selling_inquiry_count: 1, // Include total inquiry count
                    currentMonthSellingInquiry: 1, // Include current month inquiry count
                    pastMonthSellingInquiry: 1 // Include past month inquiry count
                }
            }
        ]);



        const catalogArray = await Catalog.aggregate([
            {
                $match: {
                    company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                }
            },
            {
                $lookup: {
                    from: "products", // Join with products to get product name
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "inquiries", // Join with inquiries to get inquiries related to the product
                    let: { productId: "$product._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$product_id", "$$productId"] }, // Match the product
                                seller_company_id: new mongoose.Types.ObjectId(decodedToken.companyId)
                            }
                        },
                        {
                            $lookup: {
                                from: "negotations", // Join with negotiations to get the final price
                                localField: "_id",
                                foreignField: "inquiryId",
                                as: "negotiation"
                            }
                        }
                    ],
                    as: "inquiries"
                }
            },
            {
                $unwind: {
                    path: '$inquiries',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$inquiries.negotiation',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$product._id", // Group by product
                    productName: { $first: "$product.name_of_chemical" }, // Capture the product name
                    currentMonthAmount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$inquiries.createdAt", currentMonthStart] },
                                        { $lt: ["$inquiries.createdAt", currentMonthEnd] }
                                    ]
                                },
                                "$inquiries.negotiation.final_price", // Add final price if in current month
                                0
                            ]
                        }
                    },
                    pastMonthAmount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$inquiries.createdAt", pastMonthStart] },
                                        { $lt: ["$inquiries.createdAt", pastMonthEnd] }
                                    ]
                                },
                                "$inquiries.negotiation.final_price", // Add final price if in past month
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, // Do not include the _id field
                    product: "$productName", // Map product name
                    currentMonthAmount: 1, // Include currentMonthAmount
                    pastMonthAmount: 1 // Include pastMonthAmount
                }
            }
        ]);


        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            data: {
                companies,
                products: updatedProducts,
                totalInquiries,
                companyCatalog: updatedCatalog,
                inquiryData, // Include commercial and sample inquiry data in the response
                buyingInquiryData,
                slalesData,
                totalDealDoneInquiry: totalDealDoneInquiry,
                totalReceivedCommercialInquiriesToday,
                totalReceivedCommercialInquiriesThisMonth,
                totalReceivedSampleInquiriesToday,
                totalReceivedSampleInquiriesThisMonth,
                totalGenratedPoToday,
                totalGenratedPoThisMonth,
                totalGenratedInvoiceToday,
                totalGenratedInvoiceThisMonth,
                totalSentCommercialInquiriesToday,
                totalSentCommercialInquiriesThisMonth,
                totalSentSampleInquiriesToday,
                totalSentSampleInquiriesThisMonth,
                topInquiryDetails: topInquiryDetails[0].topInquiryDetails,
                catalogSellingInquiryCountArray,
                catalogArray
            }
        });
    } catch (error) {
        console.error('Error retrieving dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve dashboard data',
            error: error.message
        });
    }
};




module.exports = {
    register,
    company_login,
    changePassword: [verifyToken, changePassword], // Use token verification middleware before executing changePassword function
    editProfile: [verifyToken, editProfile], // Use token verification middleware before executing editProfile function
    displayCompanyDetails: [verifyToken, displayCompanyDetails], // Use token verification middleware before executing displayCompanyDetails function
    updateStatus: [verifyToken, updateStatus], // Use token verification middleware before executing displayCompanyDetails function
    displayAllCompanies: [verifyToken, displayAllCompanies], // Use token verification middleware before executing displayCompanyDetails function
    displayCompanyDetail: [verifyToken, displayCompanyDetail], // Use token verification middleware before executing displayCompanyDetails function
    displayCompanyById: [verifyToken, displayCompanyById], // Use token verification middleware before executing displayCompanyDetails function
    editCompanyProfileById: [verifyToken, editCompanyProfileById], // Use token verification middleware before executing displayCompanyDetails function
    displayCompanyDetailsById: [verifyToken, displayCompanyDetailsById], // Use token verification middleware before executing displayCompanyDetails function
    forgotCompanyPassword, // Use token verification middleware before executing displayCompanyDetails function

    //Company TOken start here
    changeCompanyPassword: [verifyToken, changeCompanyPassword], // Use token verification middleware before executing displayCompanyDetails function
    editCompanyProfile: [verifyToken, editCompanyProfile], // Use token verification middleware before executing displayCompanyDetails function
    profile_display_with_other_info: [verifyToken, profile_display_with_other_info], // Use token verification middleware before executing displayCompanyDetails function

    displayTotalSellingInquirys: [verifyToken, displayTotalSellingInquirys], // Use token verification middleware before executing displayCompanyDetails function
    displayTotalSellingSampleInquirys: [verifyToken, displayTotalSellingSampleInquirys], // Use token verification middleware before executing displayCompanyDetails function
    displayTotalBuyingInquirys: [verifyToken, displayTotalBuyingInquirys], // Use token verification middleware before executing displayCompanyDetails function
    displayTotalBuyingSampleInquirys: [verifyToken, displayTotalBuyingSampleInquirys], // Use token verification middleware before executing displayCompanyDetails function
    displayCompanysById: [verifyToken, displayCompanysById], // Use token verification middleware before executing displayCompanyDetails function
    companyDetailsInfo: [verifyToken, companyDetailsInfo],
    displayEmailList,
    compnayByIdToCatalogDetails: [verifyToken, compnayByIdToCatalogDetails],
    companyLogoDetailsDisplay: [verifyToken, companyLogoDetailsDisplay],
    companyDashboard: [verifyToken, companyDashboard],

    verifyAccessToken // Export verifyAccessToken for other modules to use if needed


};
