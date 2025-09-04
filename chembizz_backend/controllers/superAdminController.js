const SuperAdmin = require('../models/superAdminModel');
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAccessToken, generateAccessToken } = require('../middleware/generateAccessToken');
const Inquiry = require('../models/inquiry'); // Import Inquiry model
const mongoose = require('mongoose');
const Company = require('../models/company'); // Update the path to your actual model files
// const Inquiry = require('./models/inquiry');
const Product = require('../models/productModel');
const Catalog = require('../models/catelog');


// const generateAccessToken = (user) => {
//   if (!process.env.ACCESS_TOKEN_SECRET) {
//     throw new Error('access_token_secret is missing or empty');
//   }

//   const { username, status, role } = user;
//   const tokenPayload = { username, status };

//   if (role === 'superadmin' || role === 'admin') {
//     tokenPayload.role = role;

//   }

//   return jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);
// };

// const login = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user with the provided username among superadmins
//     const user = await SuperAdmin.findOne({ username });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No superadmin found with this username!',
//       });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//       const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

//       if (!accessTokenSecret) {
//         throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
//       }

//       // Create token payload
//       const tokenPayload = {
//         username: user.username,
//         status: user.status,
//         role: user.role // Assuming role is present in the user document
//       };

//       // Sign token with access token secret
//       const accessToken = jwt.sign(tokenPayload, accessTokenSecret);

//       return res.json({
//         success: true,
//         message: 'Login successful!',
//         accessToken,
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: 'Password does not match!',
//       });
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     next(error);
//   }
// };

////////////////////////////////////////////////////////////////
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    // Find the superadmin with the provided email
    const superadmin = await SuperAdmin.findOne({ email });

    // If the superadmin is not found, return a 404 error
    if (!superadmin) {
      return res.status(404).json({ success: false, message: 'Superadmin not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, superadmin.password);

    // If passwords match, generate JWT token and return a successful login response with user data and token
    if (passwordMatch) {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
      }

      // Assign role as 'superadmin' for superadmin users
      const role = 'superadmin';

      // Create token payload specific to the superadmin
      const tokenPayload = {
        userId: superadmin._id,
        email: superadmin.email,
        role: role // Assign role as 'superadmin'
        // Add other user data fields as needed
      };

      // Sign token with access token secret
      const token = jwt.sign(tokenPayload, accessTokenSecret);

      return res.status(200).json({
        success: true,
        message: 'Login is successful',
        user: {
          _id: superadmin._id,
          email: superadmin.email,
          // Add other user data fields as needed
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




////////////////////////////////
// Define the addNewSuperAdmin function
const addNewSuperAdmin = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Extract username and password from req.body
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required!',
      });
    }

    // Check if a super admin with the provided email already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email });

    if (existingSuperAdmin) {
      return res.status(409).json({
        success: false,
        message: 'super admin with this email already exists!',
      });
    }

    // Hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new super admin instance
    const newSuperAdmin = new SuperAdmin({
      email,
      password: hashedPassword,
      status: 'active',
      role: 'superadmin',
    });

    // Save the new super admin to the database
    await newSuperAdmin.save();

    return res.status(201).json({
      success: true,
      message: 'super admin created successfully!',
    });
  } catch (error) {
    // If an error occurs, log it and pass it to the error handling middleware
    console.error('error during super admin creation:', error);
    next(error);
  }
};



////////////////////////////////





// Define the changePassword function
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    // Destructure username, password, and newPassword from req.body
    const { email, password, newPassword } = req.body;

    // Find the user with the given email
    const user = await SuperAdmin.findOne({ email });

    // If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'no user found with this email!',
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return a 401 error
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect!',
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the new hashed password
    user.password = hashedNewPassword;
    await user.save();

    // Return success message
    return res.json({
      success: true,
      message: 'password changed successfully!',
    });

  } catch (error) {
    // If an error occurs, log it and pass it to the error handling middleware
    console.error('Error during password change:', error);
    next(error);
  }
};





//AddAdmin
const addAdmin = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const { username, password, fullname } = req.body;
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'admin with this username already exists!',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      fullname,
      status: 'active',
    });

    await newAdmin.save();

    res.json({
      success: true,
      message: 'admin added successfully!',
      admin: newAdmin,
    });
  } catch (error) {
    console.error('error adding admin:', error);
    next(error);
  }
};

const getAllAdmins = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const allAdmins = await Admin.find({}, { password: 0 });

    res.json({
      success: true,
      message: 'all admins retrieved successfully!',
      chemical_admins: allAdmins,

    });
  } catch (error) {
    console.error('error retrieving all admins:', error);
    next(error);
  }
};


// Function to retrieve an admin by their ID
const getAdminById = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    // Extract the admin ID from the request parameters
    const { adminId } = req.params;

    // Query the database to find the admin with the provided ID
    const admin = await Admin.findById(adminId);

    // Check if the admin with the provided ID exists
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'admin not found!'
      });
    }

    // Return the admin's information
    res.json({
      success: true,
      message: 'admin retrieved successfully!',
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        password: admin.password,  // Include password
        status: admin.status,
        fullname: admin.fullname,
      }
    });
  } catch (error) {
    console.error('error retrieving admin by id:', error);
    next(error);
  }
};


//changeAdminStatus
const changeAdminStatus = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const { adminId } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'inactive') {
      return res.status(400).json({
        success: false,
        message: 'invalid status. status must be either "active" or "inactive".',
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'admin not found!',
      });
    }

    admin.status = status;
    await admin.save();

    res.json({
      success: true,
      message: 'admin status updated successfully!',
      admin: {
        _id: admin._id,
        username: admin.username,
        fullname: admin.fullname,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('error changing admin status:', error);
    next(error);
  }
};



const changePasswordAdmin = async (req, res, next) => {
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
    // Check if the user's role is 'superadmin', 'admin'
    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }
    const { username, oldPassword, newPassword } = req.body;

    // Find the admin with the provided username
    const admin = await Admin.findOne({ username });

    // If the admin is not found, return a 404 error
    if (!admin) {
      return res.status(404).json({ success: false, message: 'no admin found with this username!' });
    }

    // Compare the provided old password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(oldPassword, admin.password);

    // If old password matches, update the password with the new one
    if (passwordMatch) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
      await admin.save();
      return res.status(200).json({ success: true, message: 'password changed successfully', admin });
    } else {
      // If old password does not match, return a 401 unauthorized error
      return res.status(401).json({ success: false, message: 'old password is incorrect' });
    }
  } catch (error) {
    // Handle any unexpected errors and return a 500 internal server error
    console.error('error during password change:', error);
    return res.status(500).json({ success: false, message: 'server error', error: error.message });
  }
};


////////////////////////////////////////////

const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    // Check if mobile number matches the specified value
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email number does not match' });
    }

    // Update the superadmin's password in the database based on the mobile number
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await SuperAdmin.updateOne({}, { password: hashedPassword });

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    // If an error occurs, log it and pass it to the error handling middleware
    console.error('Error during password change:', error);
    next(error);
  }
};




//
// Function to display all inquiries based on user's role
const displayAllInquiries = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (assuming verifyAccessToken is a function that verifies the token)
    const decodedToken = verifyAccessToken(token);

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    let inquiryList;

    // Define aggregation pipeline stages based on user's role
    const pipeline = [];

    // Match stage to filter inquiries based on role
    if (['superadmin', 'admin'].includes(decodedToken.role)) {
      // For superadmins and admins, fetch all inquiries
      pipeline.push({ $match: {} });
    } else {
      // Role not recognized
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Lookup stages to populate seller company and product details
    pipeline.push(
      {
        $lookup: {
          from: 'companies',
          localField: 'seller_company_id',
          foreignField: '_id',
          as: 'seller_company'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'buyer_company_id',
          foreignField: '_id',
          as: 'buyer_company'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    );

    // Projection stage to shape the output
    pipeline.push(
      {
        $project: {
          _id: 0,
          inquiry_id: '$_id',
          buyer_company_id: 1, // Include buyer company ID
          buyer_company_id: { $arrayElemAt: ['$buyer_company', 0] },// Include buyer company ID
          seller_company: { $arrayElemAt: ['$seller_company', 0] },
          product: { $arrayElemAt: ['$product', 0] },
          inquiry_qty: 1,
          qty_type: 1,
          inq_type: 1,
          status: 1,
          category: 1,
          subcategory: 1,
          grade: 1,
          COA: 1,
          min_price: 1,
          max_price: 1,
          country_origin: 1,
          supply_capacity: 1,
          purity: 1,
          one_lot_qty: 1,
          one_lot_qty_type: 1,
          one_lot_qty_price: 1,
          payment_status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    // Execute aggregation pipeline
    inquiryList = await Inquiry.aggregate(pipeline);

    // Check if the inquiry list is empty
    if (!inquiryList || inquiryList.length === 0) {
      return res.status(404).json({ success: false, message: 'no inquiries found' });
    }

    // Send the inquiry list in the response
    return res.status(200).json({ success: true, message: 'inquiry list retrieved successfully', inquiryList });
  } catch (error) {
    // Handle any unexpected errors and return an appropriate response
    console.error(error);
    return res.status(500).json({ success: false, message: 'server error', error: error.message });
  }
};


//
// // Function to display inquiries by ID
// const displayInquiryById = async (req, res, next) => {
//   try {
//     // Extract token from request headers
//     const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

//     // Verify token (assuming verifyAccessToken is a function that verifies the token)
//     const decodedToken = verifyAccessToken(token);

//     // Check if the decoded token contains necessary information for verification
//     if (!decodedToken || !decodedToken.role) {
//       return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }

//     let inquiryList;

//     // Define aggregation pipeline stages based on user's role
//     const pipeline = [];

//     // Match stage to filter inquiries based on role and ID
//     if (['superadmin', 'admin'].includes(decodedToken.role)) {
//       // For superadmins and admins, fetch inquiries by ID
//       pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.id) } });
//     } else {
//       // Role not recognized
//       return res.status(403).json({ success: false, message: 'unauthorized access' });
//     }

//     // Lookup stages to populate seller company and product details
//     pipeline.push(
//       {
//         $lookup: {
//           from: 'companies',
//           localField: 'seller_company_id',
//           foreignField: '_id',
//           as: 'seller_company'
//         }
//       },
//       {
//         $lookup: {
//           from: 'companies',
//           localField: 'buyer_company_id',
//           foreignField: '_id',
//           as: 'buyer_company'
//         }
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'product_id',
//           foreignField: '_id',
//           as: 'product'
//         }
//       }
//     );

//     // Projection stage to shape the output
//     pipeline.push(
//       {
//         $project: {
//           _id: 0,
//           inquiry_id: '$_id',
//           buyer_company_id: 1, // Include buyer company ID
//           buyer_company_id: { $arrayElemAt: ['$buyer_company', 0] },// Include buyer company ID
//           seller_company: { $arrayElemAt: ['$seller_company', 0] },
//           product: { $arrayElemAt: ['$product', 0] },
//           inquiry_qty: 1,
//           qty_type: 1,
//           inq_type: 1,
//           status: 1,
//           category: 1,
//           subcategory: 1,
//           grade: 1,
//           COA: 1,
//           min_price: 1,
//           max_price: 1,
//           country_origin: 1,
//           supply_capacity: 1,
//           purity: 1,
//           one_lot_qty: 1,
//           one_lot_qty_type: 1,
//           one_lot_qty_price: 1,
//           createdAt: 1,
//           updatedAt: 1

//         }
//       }
//     );

//     // Execute aggregation pipeline
//     inquiryList = await Inquiry.aggregate(pipeline);

//     // Check if the inquiry list is empty
//     if (!inquiryList || inquiryList.length === 0) {
//       return res.status(404).json({ success: false, message: 'no inquiries found' });
//     }

//     // Send the inquiry list in the response
//     return res.status(200).json({ success: true, message: 'inquiry retrieved successfully', inquiryList });
//   } catch (error) {
//     // Handle any unexpected errors and return an appropriate response
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'server error', error: error.message });
//   }
// };

// Function to display inquiries by ID
const displayInquiryById = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token (assuming verifyAccessToken is a function that verifies the token)
    const decodedToken = verifyAccessToken(token);

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    let inquiryList;

    // Define aggregation pipeline stages based on user's role
    const pipeline = [];

    // Match stage to filter inquiries based on role and ID
    if (['superadmin', 'admin'].includes(decodedToken.role)) {
      // For superadmins and admins, fetch inquiries by ID
      pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(req.params.id) } });
    } else {
      // Role not recognized
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    // Lookup stages to populate seller and buyer company details
    pipeline.push(
      {
        $lookup: {
          from: 'companies',
          localField: 'seller_company_id',
          foreignField: '_id',
          as: 'seller_company'
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'buyer_company_id',
          foreignField: '_id',
          as: 'buyer_company'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    );

    // Projection stage to shape the output
    pipeline.push(
      {
        $project: {
          _id: 0,
          inquiry_id: '$_id',
          buyer_company: { $arrayElemAt: ['$buyer_company', 0] }, // Include buyer company
          seller_company: { $arrayElemAt: ['$seller_company', 0] }, // Include seller company
          product: { $arrayElemAt: ['$product', 0] },
          inquiry_qty: 1,
          qty_type: 1,
          inq_type: 1,
          status: 1,
          category: 1,
          subcategory: 1,
          grade: 1,
          COA: 1,
          min_price: 1,
          max_price: 1,
          country_origin: 1,
          supply_capacity: 1,
          purity: 1,
          one_lot_qty: 1,
          inq_lot_qty: 1,
          one_lot_qty_type: 1,
          one_lot_qty_price: 1,
          payment_status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    // Execute aggregation pipeline
    inquiryList = await Inquiry.aggregate(pipeline);

    // Check if the inquiry list is empty
    if (!inquiryList || inquiryList.length === 0) {
      return res.status(404).json({ success: false, message: 'no inquiries found' });
    }

    // Send the inquiry list in the response
    return res.status(200).json({ success: true, message: 'inquiry retrieved successfully', inquiryList });
  } catch (error) {
    // Handle any unexpected errors and return an appropriate response
    console.error(error);
    return res.status(500).json({ success: false, message: 'server error', error: error.message });
  }
};

const adminDeshboard = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // Verify token
    const decodedToken = verifyAccessToken(token);

    // Check if the decoded token contains necessary information for verification
    if (!decodedToken || !decodedToken.role) {
      return res.status(403).json({ success: false, message: 'unauthorized access' });
    }

    const totalCompanies = await Company.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    const totalApprovedInquiries = await Inquiry.countDocuments({ status: 'approved' });
    const totalProductsInCatalog = await Catalog.countDocuments();

    // const allCompanies = await Company.find();
    // const allInquiries = await Inquiry.find().populate('buyer_company_id').populate('seller_company_id').populate('product_id');
    // const allProductsInCatalog = await Catalog.find().populate('company_id').populate('product_id');

    const top10RegisteredCompanies = await Company.find().sort({ createdAt: -1 }).limit(10).select('-password');
    const top10ProductInquiries = await Inquiry.aggregate([
      { $group: { _id: "$product_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products", // The collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      }
    ]);

    res.json({
      totalCompanies,
      totalInquiries,
      totalApprovedInquiries,
      totalProductsInCatalog,
      top10RegisteredCompanies,
      top10ProductInquiries
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'server error', error: error.message });
  }
}



const catalogSellingInquiry = async (req, res) => {
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

    let { catalog_id, company_id } = req.params

    console.log(catalog_id)

    let catalogData = await Catalog.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(catalog_id),
          // company_id: new mongoose.Types.ObjectId(company_id)
        }
      },
      {
        $lookup: {
          from: "inquiries",
          localField: "product_id",
          foreignField: "product_id",
          as: "selling_inquiry_details",
          pipeline: [
            {
              $match: {
                seller_company_id: new mongoose.Types.ObjectId(company_id)
              }
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
            {
              $lookup: {
                from: 'products',
                localField: 'product_id',
                foreignField: '_id',
                as: 'product'
              }
            },
            {
              $lookup: {
                from: 'negotations',
                localField: '_id',
                foreignField: 'inquiryId',
                as: 'negotation'
              }
            }
          ]
        },
      },

    ]);

    res.status(200).json({
      sucess: true,
      message: "catalog selling inquiry details",
      data: catalogData
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    })
  }
}



module.exports = {
  login,
  addAdmin: [verifyToken, addAdmin],
  changePassword: [verifyToken, changePassword],
  getAllAdmins: [verifyToken, getAllAdmins],
  changeAdminStatus: [verifyToken, changeAdminStatus],
  getAdminById: [verifyToken, getAdminById],
  addNewSuperAdmin, //: [verifyToken, addNewSuperAdmin],
  changePasswordAdmin: [verifyToken, changePasswordAdmin],
  forgotPassword,
  displayAllInquiries: [verifyToken, displayAllInquiries],
  displayInquiryById: [verifyToken, displayInquiryById],
  adminDeshboard: [verifyToken, adminDeshboard],
  catalogSellingInquiry: [verifyToken, catalogSellingInquiry],
  verifyAccessToken,

};