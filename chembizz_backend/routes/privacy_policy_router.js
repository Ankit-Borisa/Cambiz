const router = require("express").Router();
const privacy_policy_controller = require("../controllers/privacy_policy_controller");






router.put("/update", privacy_policy_controller.editData);
router.get("/display", privacy_policy_controller.displayData);




module.exports = router
