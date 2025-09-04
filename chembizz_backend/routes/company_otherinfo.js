const express = require('express');
//const { verifyToken } = require('../middleware/generateAccessToken');

// const {
//     createCompany_otherinfo,
//     updateCompany_otherinfo,
//     createCompany_otherinfos,
//     updateCompany_otherinfos

//     }=require('../controllers/company_otherinfocontroller')

const company_otherinfocontroller = require('../controllers/company_otherinfocontroller');


const upload = require('../middleware/upload')

const { validatecompanyOtherInfo } = require('../middleware/validationMiddleware');
const { verifyToken } = require('../middleware/generateAccessToken');
const { azureUpload } = require('../middleware/blobMulter');


const router = express.Router();

router.post('/companyotherinfo/create', azureUpload.single('logo'), validatecompanyOtherInfo, company_otherinfocontroller.createCompany_otherinfo)
router.put('/companyotherinfo/update/:company_otherinfoId', azureUpload.single('logo'), company_otherinfocontroller.updateCompany_otherinfo)

//company start here
router.post('/companyotherinfo/a', azureUpload.single('logo'), validatecompanyOtherInfo, company_otherinfocontroller.createCompany_otherinfos);

router.put('/companyotherinfo/updates/:company_otherinfoId', azureUpload.single('logo'), company_otherinfocontroller.updateCompanyOtherInfo)

router.patch('/companyotherinfo/updateCompanyBanner',verifyToken,azureUpload.single("banner"),company_otherinfocontroller.updateCompanyBanner);
//router.put('/companyotherinfo/update/:company_id', upload.array('logo[]'), updateCompany_otherinfo);

module.exports = router;




