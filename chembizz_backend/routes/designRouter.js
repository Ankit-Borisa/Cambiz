const router = require("express").Router();
const designController = require("../controllers/designController");
const upload = require("../middleware/designphoto");
const { azureUpload } = require('../middleware/blobMulter');


router.post("/create", azureUpload.single('design'), designController.createDesign);
router.get("/displayList", designController.displayList);
router.get("/displayByCompany", designController.companyDisplayList)
router.delete("/remove/:designId", designController.removeDesign)



module.exports = router