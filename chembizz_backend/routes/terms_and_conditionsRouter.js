const router = require("express").Router();
const teamsAndConditionController = require("../controllers/terms_and_conditions");




router.post("/insert", teamsAndConditionController.insertData);
router.put("/update/:id", teamsAndConditionController.editData)
router.get("/display", teamsAndConditionController.displayData)
router.delete("/delete/:id", teamsAndConditionController.deleteTermsAndCondition)

module.exports = router

