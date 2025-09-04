const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const { validateAdmin } = require('../middleware/validationMiddleware');

// Admin Login
router.post('/login', validateAdmin, login);

// Admin Login
 
module.exports = router;


 