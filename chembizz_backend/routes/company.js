const express = require('express')
const router = express.Router()
//const { verifyToken } = require('../middleware/generateAccessToken');

const CompanyController = require('../controllers/companyController')
const { validatecompany } = require('../middleware/validationMiddleware');

// const companyController = require('../controllers/companyController');



router.post('/register', validatecompany, CompanyController.register);
router.post('/login', CompanyController.company_login);
// router.get('/display/:id', CompanyController.displayCompanyProfile);
// router.get('/displayall', CompanyController.displayAllCompanyProfiles);
router.put('/changePassword', CompanyController.changePassword);
router.put('/editProfile/:id', CompanyController.editProfile);
router.get('/companyinfo', CompanyController.displayCompanyDetails);
router.get('/companyDetail/:companyId', CompanyController.displayCompanyDetail);
router.put('/status', CompanyController.updateStatus);
router.get('/all', CompanyController.displayAllCompanies);
router.get('/full/:id', CompanyController.displayCompanyDetailsById);
router.get('/profile/:id', CompanyController.displayCompanyById);
router.put('/edit_profile/:id', CompanyController.editCompanyProfileById);

// router.get('/sell', CompanyController.displayTotalSellingInquiry);
// router.get('/sellsample', CompanyController.displayTotalSellingSampleInquiry);
// router.get('/buy', CompanyController.displayTotalBuyingInquiry);
// router.get('/buysample', CompanyController.displayTotalBuyingSampleInquiry);


router.post('/forgot', CompanyController.forgotCompanyPassword);



/// Company TOken start here
router.put('/edit', CompanyController.editCompanyProfile);
router.put('/change', CompanyController.changeCompanyPassword);  //check 
router.get('/cominfo', CompanyController.profile_display_with_other_info);  //check 

router.get('/si', CompanyController.displayTotalSellingInquirys);  //check   // base url check baki
router.get('/ss', CompanyController.displayTotalSellingSampleInquirys);  //check 
router.get('/bi', CompanyController.displayTotalBuyingInquirys);  //check 
router.get('/bs', CompanyController.displayTotalBuyingSampleInquirys);  //check 

router.get('/com/:id', CompanyController.displayCompanysById);  //check 

router.get("/companyDetails", CompanyController.companyDetailsInfo)

router.get("/emailList", CompanyController.displayEmailList)

router.get("/compnayDetails", CompanyController.companyLogoDetailsDisplay)

router.get("/companyDisplayByCatalog/:companyId", CompanyController.compnayByIdToCatalogDetails)

router.get("/deshBoard", CompanyController.companyDashboard)

module.exports = router