const router = require("express").Router();
const companyAddressController = require("../controllers/company_address_controller");




router.post("/insert", companyAddressController.insertCompanyAddress);
router.put("/update/:addressId", companyAddressController.editCompanyAddress);
router.get("/display", companyAddressController.displayCompanyAddresses);
router.delete("/delete/:addressId", companyAddressController.deleteCompanyAddress);



module.exports = router