const router = require("express").Router();
const standard_terms_and_condition_controller = require("../controllers/standard_terms_and_condition_controller");
// const stamdard_terms_and_condition_controller = require("../controllers/standard_terms_and_condition_controller");



router.put("/update/:id", standard_terms_and_condition_controller.updateData);
router.get("/display", standard_terms_and_condition_controller.displayData);



module.exports = router
