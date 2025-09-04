const express = require('express');
const router = express.Router();
const SuperAdminController = require('../controllers/superAdminController');
const { validateSuperadmin, validateAdmin } = require('../middleware/validationMiddleware');
const jwt = require('jsonwebtoken');
//const { verifyToken } = require('../middleware/generateAccessToken');


// Super Admin Login
router.post('/login', SuperAdminController.login);

// Add new Admin by Super Admin
router.post('/addadmin', validateAdmin, SuperAdminController.addAdmin);

// Display all Admins to Super Admin
router.get('/alladmins', SuperAdminController.getAllAdmins);

// Change status of Admin by Sup, er Admin
router.put('/changeadminstatus/:adminId', SuperAdminController.changeAdminStatus);

router.get('/adminbyid/:adminId', SuperAdminController.getAdminById);

router.post('/changePassword', validateSuperadmin, SuperAdminController.changePassword);
router.post('/addNewSuperAdmin', SuperAdminController.addNewSuperAdmin);
router.put('/changepass', SuperAdminController.changePasswordAdmin);
router.put('/forgotpassword', SuperAdminController.forgotPassword);

router.get('/inquiry', SuperAdminController.displayAllInquiries);
router.get('/inquiry/:id', SuperAdminController.displayInquiryById);

router.get("/deshboard", SuperAdminController.adminDeshboard)

router.get("/catalogSellingInquiry/:catalog_id/:company_id", SuperAdminController.catalogSellingInquiry)

// Define product routes (if needed)
// Example: router.post('/addProduct', SuperAdminController.addProduct);

module.exports = router;





//app.use('localhost:3000/api/superadmin', superAdminRoutes);
//app.use('localhost:3000/api/admin', adminRoutes);

// POST      localhost:3000/api/superadmin/login
// POST      localhost:3000/api/superadmin/addProduct
// POST      localhost:3000/api/superadmin/login/addadmin
// GET       localhost:3000/api/superadmin/login/alladmins
// PUT       localhost:3000/api/superadmin/changeadminstatus/:adminId
