const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { validateCatalog } = require('../middleware/validationMiddleware');
//const { verifyToken } = require('../middleware/generateAccessToken');


const COA = require('../middleware/coa'); // Adjust the path

const {azureUpload}= require('../middleware/blobMulter');

// Add a new catalog with a file upload

//router.post('/catalogs', validateCatalog, catalogController.addCatalog);
// router.post('/catalogs', COA.single('COA'), validateCatalog, catalogController.addCatalog);


// Edit catalog details by ID
// this api is for admin and superadmin for change catalog details.
router.put('/catalogs/:catalogId', azureUpload.single('COA'), catalogController.editCatalogById);

// Display list of catalogs with associated product details
router.get('/catalogs', catalogController.getCatalogs);


//Company Start here
//router.post('/catalogs', validateCatalog, catalogController.addCatalog);
router.post('/catalog', azureUpload.single('COA'), validateCatalog, catalogController.addCatalogs);


// Edit catalog details by ID
// this api is edit catalog details from company end.
router.put('/catalog/:catalogId', COA.single('COA'), catalogController.editCatalogsById);

// Display list of catalogs with associated product details
router.get('/catalog', catalogController.getCatalog);
router.get('/allcatalog', catalogController.displayCompanyCatalogs);

router.get('/getcatalog/:catalogId', catalogController.getCatalogById);

router.put('/status', catalogController.catalogStatusUpdate);



module.exports = router;



