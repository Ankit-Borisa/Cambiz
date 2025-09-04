const Grade = require('../models/grade');
const { validationResult } = require('express-validator');
const { verifyToken, verifyAccessToken } = require('../middleware/generateAccessToken');

const createGrade = async (req, res) => {
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

    const { grade_name, category_id } = req.body;

    // Check if grade_name and category_id are provided
    if (!grade_name || !category_id) {
      return res.status(400).json({ success: false, message: 'Grade name and category ID are required' });
    }

    const grade = new Grade({ grade_name, category_id });
    await grade.save();
    res.status(201).json({ success: true, message: 'Grade created successfully', grade: grade });

  } catch (error) {
    // Handle any unexpected errors and return a 500 internal server error
    console.error('Error creating grade:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};




const getAllGrades = async (req, res) => {
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
    // Fetch grades along with category information from the database
    const grades = await Grade.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id', // Use 'category_id' as the localField
          foreignField: '_id', // Match with '_id' field in the 'categories' collection
          as: 'categoryDetail'
        }
      },
      {
        $project: {
          _id: 1,
          grade_name: 1,
          category_id: 1,
          'categoryDetail.category_name': 1, // Use categoryName instead of category_name
          'categoryDetail._id': 1,
          'categoryDetail.createdAt': 1,
          'categoryDetail.updatedAt': 1
        }
      }
    ]);

    // Check if no grades are found
    if (!grades || grades.length === 0) {
      console.log('no grades found.');
      return res.status(404).json({ error: 'no grades found' });
    }

    // Respond with the retrieved grades
    res.status(200).json({ success: true, message: 'all grades retrieved successfully', grades: grades });
  } catch (error) {
    // Handle errors
    console.error('error fetching grades:', error);
    res.status(500).json({ error: `internal server error: ${error.message}` });
  }
};


// const getAllGrades = async (req, res) => {
//   try {
//     const grades = await Grade.find();
//     res.status(200).json({ data: grades });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getGradeById = async (req, res) => {
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
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'grade not found' });
    }
    res.status(200).json({ success: true, message: 'grade retrieved successfully', grade: grade });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGrade = async (req, res) => {
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
    const { grade_name, category_id } = req.body;
    const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, { grade_name, category_id }, { new: true });
    if (!updatedGrade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }
    res.status(200).json({ success: true, message: 'Grade updated successfully', grade: updatedGrade });
  } catch (error) {
    res.status(500).json({ success: false, error: `Internal server error: ${error.message}` });
  }
};

const deleteGrade = async (req, res) => {
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
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }

    // Send response with the deleted grade object
    res.status(200).json({ success: true, message: 'Grade deleted successfully', deletedGrade: grade });
  } catch (error) {
    // Handle any unexpected errors and return a 500 internal server error
    console.error('Error deleting grade:', error);
    res.status(500).json({ success: false, error: `Internal server error: ${error.message}` });
  }
};

module.exports = {
  createGrade: [verifyToken, createGrade],
  getAllGrades: [verifyToken, getAllGrades],
  getGradeById: [verifyToken, getGradeById],
  updateGrade: [verifyToken, updateGrade],
  deleteGrade: [verifyToken, deleteGrade],
  verifyAccessToken
};
