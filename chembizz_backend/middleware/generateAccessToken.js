const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization header is missing.' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ success: false, message: 'Token verification failed.' });
    }

    // Store decoded token in the request object for further use
    req.user = decoded;
    next();
  });
};

// Function to generate JWT token
const generateAccessToken = (user) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
  }

  let permissions = [];

  // Load permissions dynamically based on the user's role
  switch (user.role) {
    case 'superadmin':
    case 'admin':
      permissions = ['*']; // Grant access to all permissions for superadmin and admin
      break;
    case 'company':
      // Load permissions dynamically for the company role
      permissions = loadCompanyPermissions();
      break;
    default:
      throw new Error('Invalid user role.');
  }

  const tokenPayload = {
    username: user.username,
    status: user.status,
    role: user.role,
    permissions,
  };

  return jwt.sign(tokenPayload, accessTokenSecret);
};

// Function to verify JWT token
const verifyAccessToken = (token) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is missing or empty in the environment variables.');
  }

  if (!token) {
    throw new Error('Token is missing.');
  }

  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (error) {
    throw new Error('Token verification failed. Invalid or expired token.');
  }
};

// Example function to load permissions for the company role from an external source
const loadCompanyPermissions = () => {
  // Logic to load permissions for the company role
  // This could involve querying a database or loading from a configuration file
  return ['addInquiry', 'displaySpecificSellingInquiryDetails', 'displaySellingInquiryList', 'displayProductWithCompanyInfo', 'displayBuyingInquiryDetails', 'displayBuyingInquiries'];
};



module.exports = {
  generateAccessToken,
  verifyAccessToken,
  verifyToken,
};
