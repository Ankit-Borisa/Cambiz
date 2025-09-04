const router = require("express").Router();
const adminTeamsAndCondition = require("../controllers/admin_terms_and_condition");






router.put("/update", adminTeamsAndCondition.editData);
router.get("/display", adminTeamsAndCondition.displayData);




module.exports = router
