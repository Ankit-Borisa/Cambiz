const express = require('express');
// const {
//   createCertificate,
//   updateCertificate,
//   showCertificate,
//   deleteCertificateById
// } = require('../controllers/certificateController');

const CertificateController = require('../controllers/certificateController');
//onst { verifyToken } = require('../middleware/generateAccessToken');
const { validatecertificate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/certificates', validatecertificate, CertificateController.createCertificate);
router.put('/certificates/:certificateId', validatecertificate,  CertificateController.updateCertificate);
router.get('/certificates',  CertificateController.showCertificate);
router.delete('/delete/:certificateId',  CertificateController.deleteCertificateById);


module.exports = router;
