const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const upload = require('../middleware/doc');
const { validateDocuments } = require('../middleware/validationMiddleware');

const { azureUpload } = require('../middleware/blobMulter');


// Route for creating documents
router.post('/create', azureUpload.single('doc_file'), validateDocuments, documentsController.addDocument);

// Route for getting all documents
router.get('/getAll', documentsController.getDocumentDetails);

// Route for updating a document by ID
router.put('/update/:id', azureUpload.single('doc_file'),  documentsController.updateDocumentById);


//Company Start here
// Route for creating documents
router.post('/creates', azureUpload.single('doc_file'), validateDocuments, documentsController.addDocuments);

// Route for getting all documents
router.get('/getallDetails', documentsController.getDocumentsDetails);
router.get('/getal', documentsController.getDocumentsDetail_cr);
router.get('/get', documentsController.getDocumentsDetail);

// Route for updating a document by ID
router.put('/updates/:id', upload.single('doc_file'),  documentsController.updateDocumentsById);

module.exports = router;


  