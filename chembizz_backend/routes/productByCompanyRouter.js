const router = require("express").Router();
const productByCompanyController = require("../controllers/productByCompanyController");
const uploads = require('../middleware/uploads');


const { azureUpload } = require('../middleware/blobMulter');





router.post("/insert", azureUpload.single('structure'), productByCompanyController.companyAdd);
router.get("/displayList", productByCompanyController.displayList);
router.get("/displayDetails/:id", productByCompanyController.displayDetails)
router.delete("/delete/:id", productByCompanyController.deleteProductById)


module.exports = router