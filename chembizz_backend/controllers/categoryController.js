const express = require('express');
const Category = require('../models/category');
//const catalogRoutes = express.Router();
const { verifyAccessToken, verifyToken } = require('../middleware/generateAccessToken');
const { validationResult } = require('express-validator');



// Function to search categories by ID and display them
const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
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
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'category not found' });

    }
    res.status(200).json({ 
      success: true, 
      message: 'category retrieved successfully', 
      category: category });

  } catch (error) {
    res.status(500).json({ error: `error fetching category: ${error.message}` });
  }
};


const getAllCategories = async (req, res, next) => {
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
    const categories = await Category.find();
    
    res.status(200).json({
      success: true,
      message: 'all categories retrieved successfully!',
      categories: categories
    });
  } catch (error) {
    console.error('error fetching categories:', error);
    next(error);
  }
};
 
  
const addCategory = async (req, res) => {
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
    const { category_name } = req.body;

    // Check if category_name is provided
    if (!category_name) {
      return res.status(400).json({ error: 'category name is required' });
    }

    // Create a new category instance
    const newCategory = new Category({
      category_name,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    res.status(201).json({ 
      success: true, 
      message: 'category added successfully', 
      category: savedCategory });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
};

// updateCategory
  const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const updatedData = req.body;
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
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $set: updatedData },
        { new: true }
      );
      res.status(200).json({ 
        success: true, 
        message: 'category updated successfully', 
        category: updatedCategory });

    } catch (error) {
      res.status(500).json({ error: `error updating category: ${error.message}` });
    }
  };
  
  // deleteCategory
  const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
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
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      res.status(200).json({ success: true, 
        message: 'category deleted successfully', 
        category: deletedCategory });

    } catch (error) {
      res.status(500).json({ error: `error deleting category: ${error.message}` });
    }
  };
  
  module.exports = {
    getCategoryById: [verifyToken, getCategoryById], // Adding the new function to exports
    getAllCategories : [verifyToken, getAllCategories],
    addCategory : [verifyToken, addCategory],
    updateCategory : [verifyToken, updateCategory],
    deleteCategory : [verifyToken, deleteCategory],
    verifyAccessToken
  };
  
