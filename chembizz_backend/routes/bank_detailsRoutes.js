const express = require('express');
const router = express.Router();
const Bank_detailsController = require('../controllers/bank_detailsController');
const { validatebankDetails } = require('../middleware/validationMiddleware');
//const { verifyToken } = require('../middleware/generateAccessToken');

const {azureUpload} = require("../middleware/blobMulter")

// const CCP = require('../middleware/cancel_cheque_photo'); 

// Add a new catalog with a file upload

//router.post('/catalogs', validateCatalog, catalogController.addCatalog);
router.post('/add', azureUpload.single('cancel_cheque_photo'), validatebankDetails, Bank_detailsController.addBankDetails);
router.put('/edit/:bankDetailsId', azureUpload.single('cancel_cheque_photo'), Bank_detailsController.editBankDetailsById);
router.get('/getall', Bank_detailsController.getAllBankDetails);
router.get('/data', Bank_detailsController.getBankDetailsById);
router.put("/updateBankPriority/:bankId", Bank_detailsController.updateBankPriority)






module.exports = router;


