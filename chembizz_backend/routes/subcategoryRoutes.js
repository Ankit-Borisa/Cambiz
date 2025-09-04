const express = require('express');
const router = express.Router();
const SubcategoryController = require('../controllers/subcategoryController');

const { validateSubCategorySchema } = require('../middleware/validationMiddleware');
// Route for creating a new subcategory
router.post('/subcategories', validateSubCategorySchema, SubcategoryController.addSubcategory);

// Route for getting all subcategories
router.get('/subcategories', SubcategoryController.getAllSubcategories);

router.get('/allsubcategories', SubcategoryController.getSubcategories);

// Route for getting a single subcategory by ID
router.get('/subcategories/:id', SubcategoryController.getSubcategoryById);

// Route for updating a subcategory by ID
router.put('/subcategories/:id',  SubcategoryController.updateSubcategoryById);

// Route for deleting a subcategory by ID
router.delete('/subcategories/:id', SubcategoryController.deleteSubcategoryById);

module.exports = router;
