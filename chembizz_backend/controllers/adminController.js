const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../middleware/generateAccessToken');

// const generateAccessToken = (admin) => {
//   if (!process.env.ACCESS_TOKEN_SECRET) {
//     throw new Error('access_token_secret is missing or empty');
//   }

//   return jwt.sign(
//     {
//       username: admin.username,
//       status: admin.status,
//     },
//     process.env.ACCESS_TOKEN_SECRET
//   );
// };

const login = async (req, res, next) => {
  try {
    // // Extract token from request headers
    // const token = req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>" format

    // // Verify token
    // const decodedToken = verifyAccessToken(token); // Assuming verifyAccessToken is a function that verifies the token

    // // Check if the decoded token contains necessary information for verification
    // if (!decodedToken || !decodedToken.role) {
    //     return res.status(403).json({ success: false, message: 'unauthorized access' });
    // }

    // // Proceed to add inquiry if the user has the required role
    // // Check if the user's role is 'superadmin', 'admin'
    // if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
    //     return res.status(403).json({ success: false, message: 'unauthorized access' });
    // }
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Check if any admins are registered
    const existingAdminsCount = await Admin.countDocuments();

    if (existingAdminsCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'No admin registered. Please contact the system administrator to set up an admin account.',
      });
    }

    // Find the admin with the provided username
    const admin = await Admin.findOne({ username });

    // If the admin is not found, return a 404 error
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No admin found with this username!',
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    // If passwords match, generate JWT token and return a successful login response with user data and token
    if (passwordMatch) {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      if (!accessTokenSecret) {
        throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
      }

      // Assign role as 'admin' for admin users
      const role = 'admin';

      // Create token payload specific to the admin
      const tokenPayload = {
        userId: admin._id,
        username: admin.username,
        role: role // Assign role as 'admin'
        // Add other user data fields as needed
      };

      // Sign token with access token secret
      const token = jwt.sign(tokenPayload, accessTokenSecret);

      return res.status(200).json({ 
        success: true, 
        message: 'Login is successful',
        user: { 
          _id: admin._id,
          username: admin.username,
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






module.exports = { login };
