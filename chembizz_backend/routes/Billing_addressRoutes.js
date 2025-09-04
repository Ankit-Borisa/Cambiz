const express = require('express');
const router = express.Router();
const Billing_addressController = require('../controllers/Billing_addressController');
const { validatebillingAddress } = require('../middleware/validationMiddleware');
//const { verifyToken } = require('../middleware/generateAccessToken');



// Add a new catalog with a file upload
 
//router.post('/catalogs', validateCatalog, catalogController.addCatalog);
router.post('/add',  validatebillingAddress, Billing_addressController.addBillingAddress);
router.put('/edit/:id', Billing_addressController.editBillingAddressById);
router.get('/getall', Billing_addressController.displayAllBillingAddresses);
router.get('/data', Billing_addressController.displayBillingAddressById);







module.exports = router;


 