// Import required modules
const express = require('express'); // Import express framework
const router = express.Router(); // Create router instance
const InquiryController = require('../controllers/inquiryController'); // Import addInquiry function from inquiryController
const { validateinquiry } = require('../middleware/validationMiddleware')

const COA = require('../middleware/coa_inquiry'); // Adjust the path

// Define routes

// Route for adding inquiry

router.post('/inquiries', COA.single('COA'), validateinquiry, InquiryController.addInquiry);
router.get('/buylist/:inq_type', InquiryController.displayBuyingInquiryList);
router.get('/buydetail/:id', InquiryController.displayBuyingInquiryDetailsById);

router.get('/samplelist', InquiryController.displayBuyingInquirySampleDetails);

router.get('/selllist', InquiryController.displaySellingInquiryList);
router.get('/selldetail/:id', InquiryController.displaySellingInquiryDetailsById);
router.get('/sellsample', InquiryController.displaySellingInquirySampleDetails);

router.put('/update-inquiry/:inquiryId', InquiryController.updateInquiryStatus)

router.get('/all', InquiryController.displayAllInquiries);

router.get("/buyerList", InquiryController.displayBuyerInquiryList);

router.get("/buyerCompanyAndSallerCompany/:token_type", InquiryController.displayBuyercpmpanyAndSallercompany)

router.get("/inquiryDisplayById/:id", InquiryController.inquiryDetailsById);

router.get("/inquiryDetailsForCompany/:id", InquiryController.inquiryDetailsForCompany)

router.put("/updateStatus/:inquiryId", InquiryController.inquiryStatusChange)

router.put("/allInquiryStatusCancel", InquiryController.allInquiryCancelStatus)














// router.get('/buys', InquiryController.buy);
// router.get('/buying_id/:id', InquiryController.displayBuyingInquiryDetail);

// router.get('/cominfo', InquiryController.displayProductWithCompanyInfo);
// router.get('/cominfo/:id', InquiryController.displayProductWithCompanyInfoById);

// // router.get('/sells', InquiryController.selling);
// router.get('/selling_details/:id', InquiryController.displaySellingInquiryDetails);





// router.get('/displayAll', InquiryController.displayAll);


// router.get('/buy', InquiryController.displayAllBuyingInquirieslist);
// router.get('/allsell', InquiryController.displayAllSellingInquiriesList);
// router.get('/buying_inquiry/:id', InquiryController.displayBuyingInquiryDetails);


module.exports = router;



