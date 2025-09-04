const jwt = require('jsonwebtoken'); // Make sure to import the 'jsonwebtoken' library
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/certificate');

//createCertificate
const createCertificate = async (req, res) => {
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
    const { certificate_name } = req.body;
    const newCertificate = new Certificate({ certificate_name });
    const savedCertificate = await newCertificate.save();
    //token
    res.status(201).json({ 
      success: true, 
      message: 'certificate created successfully', 
      certificate: savedCertificate });
    // res.status(201).json({savedCertificate});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};

//updateCertificate
const updateCertificate = async (req, res) => {
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
    const { certificateId } = req.params;
    const { certificate_name} = req.body;
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      certificateId,
      { certificate_name },
      { new: true }
    );

    if (!updatedCertificate) {
      return res.status(404).json({ success: false, error: 'certificate not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'certificate updated successfully', 
      certificate: updatedCertificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'internal server error' });
  }
};



//showCertificate
const showCertificate = async (req, res, next) => {
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
    const certificate = req.body;
    
    const certificates = await Certificate.find();

    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({
      success: true,
      message: 'all certificates retrieved successfully!',
      certificates: certificates,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteCertificateById = async (req, res) => {
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
    const { certificateId } = req.params;

    const deletedCertificate = await Certificate.findByIdAndDelete(certificateId);

    if (!deletedCertificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found!',
      });
    }

    return res.json({
      success: true,
      message: 'Certificate deleted successfully!',
      deletedCertificate,
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  createCertificate : [verifyToken, createCertificate],
  updateCertificate : [verifyToken, updateCertificate],
  showCertificate : [verifyToken, showCertificate],
  deleteCertificateById : [verifyToken, deleteCertificateById],
  verifyAccessToken
};

