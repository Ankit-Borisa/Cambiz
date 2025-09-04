const router = require("express").Router();
const plan_controller = require("../controllers/membership_plan_controller")


router.post('/insert', plan_controller.add_plan);
router.get('/display', plan_controller.display_plan);
router.get("/displayById/:planId", plan_controller.display_plan_with_id);
router.put("/update/:plan_name_id", plan_controller.update_plan);
router.put("/updateStutus/:membership_plan_id/:membership_feature_id", plan_controller.update_membership_feature_status);
router.delete("/delete/:planId", plan_controller.delete_membership_plan)
router.put("/updateStatus", plan_controller.update_status)


module.exports = router