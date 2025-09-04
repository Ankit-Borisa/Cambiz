const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { validateGrade } = require('../middleware/validationMiddleware')


// Route for creating a new grade
router.post('/grades', validateGrade, gradeController.createGrade);

// Route for retrieving all grades
router.get('/grades', gradeController.getAllGrades);

// Route for retrieving a specific grade by ID
router.get('/grades/:id', gradeController.getGradeById);

// Route for updating a specific grade by ID
router.put('/grades/:id',validateGrade, gradeController.updateGrade);

// Route for deleting a specific grade by ID
router.delete('/grades/:id', gradeController.deleteGrade);

module.exports = router;
