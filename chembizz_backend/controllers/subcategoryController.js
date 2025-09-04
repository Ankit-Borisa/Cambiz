const Subcategory = require('../models/subcategory');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');
const { validationResult } = require('express-validator');
 
// Create a new subcategory
 
const addSubcategory = async (req, res) => {
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
    const { subcategory_name, category_id } = req.body;

    // Check if both subcategory_name and category_id are provided
    if (!subcategory_name || !category_id) {
      return res.status(400).json({ error: 'both subcategory_name and category_id are required' });
    }

    const newSubcategory = new Subcategory({
      subcategory_name,
      category_id
    });

    const savedSubcategory = await newSubcategory.save();
    res.status(201).json({
      success: true,
      message: 'subcategory saved successfully!',
      data: savedSubcategory
    });
   // res.status(201).json({ data: savedSubcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'internal server error' });
  }
};


 


// Get all subcategories
const getAllSubcategories = async (req, res) => {
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
    const subcategories = await Subcategory.find();
    res.status(200).json({ success: true, message: 'all subcategories retrieved successfully', subcategories: subcategories });
  } catch (error) {
    console.error('error fetching subcategories:', error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};

// Get a single subcategory by ID
const getSubcategoryById = async (req, res) => {
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
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ error: 'subcategory not found' });
    }
    res.status(200).json({
      success: true,
      message: 'subcategory retrieved successfully',
      subcategory: subcategory
    //res.status(200).json({ data: subcategory
     });
  } catch (error) {
    console.error('error fetching subcategory by id:', error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};

// Update a subcategory by ID
const updateSubcategoryById = async (req, res) => {
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
    const { id } = req.params;
    const { subcategory_name, category_id } = req.body;
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, { subcategory_name, category_id }, { new: true });
    if (!updatedSubcategory) {
      return res.status(404).json({ error: 'subcategory not found' });
    }
    res.status(200).json({
      success: true,
      message: 'subcategory updated successfully!',
      updatedSubcategory: updatedSubcategory
    //res.status(200).json({ message: 'subcategory updated successfully', data: updatedSubcategory 
  });
  } catch (error) {
    console.error('error updating subcategory by id:', error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};

// Delete a subcategory by ID
const deleteSubcategoryById = async (req, res) => {
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
    const { id } = req.params;
    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);
    if (!deletedSubcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }
    
    // Send response with the deleted subcategory object
    res.status(200).json({ success: true, message: 'Subcategory deleted successfully', deletedSubcategory });
  } catch (error) {
    // Handle any unexpected errors and return a 500 internal server error
    console.error('Error deleting subcategory by id:', error);
    res.status(500).json({ success: false, error: `Internal server error: ${error.message}` });
  }
};




const getSubcategories = async (req, res) => {
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
    const subcategoriesWithCategories = await Subcategory.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'categoryDetail'
        }
      },
      // Uncomment below if multiple categories per sub category
        // { $unwind: '$categoryDetails' }, // Corrected: Changed 'category' to 'categoryDetails'
      {
        $project: {
          _id: 1,
          subcategory_name: 1,
          createdAt: 1,
          updatedAt: 1,
          category_id: 1,
          'categoryDetail.category_name': 1,
          'categoryDetail.createdAt': 1,
          'categoryDetail.updatedAt': 1,
        }
      }
    ]);

    if (!subcategoriesWithCategories || subcategoriesWithCategories.length === 0) {
      console.log('no subcategories found.');
      return res.status(404).json({ error: 'no subcategories found' });
    }

    res.status(200).json({
      success: true,
      message: 'subcategories with category details',
      subcategoriesWithCategories: subcategoriesWithCategories,
    });
  } catch (error) {
    console.error('error getting subcategories with category details:', error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};





module.exports = { 
    addSubcategory : [verifyToken, addSubcategory], 
    getAllSubcategories : [verifyToken, getAllSubcategories], 
    getSubcategoryById : [verifyToken, getSubcategoryById], 
    updateSubcategoryById : [verifyToken, updateSubcategoryById], 
    deleteSubcategoryById : [verifyToken, deleteSubcategoryById],
    getSubcategories: [verifyToken, getSubcategories],
    verifyAccessToken
};


