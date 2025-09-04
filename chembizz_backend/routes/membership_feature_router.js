const router = require("express").Router();
const membershipFeatureController = require("../controllers/membership_feature_controller");



router.post("/insert", membershipFeatureController.add_membership_feature);
router.get("/findAll", membershipFeatureController.display_membership_feature);
router.get("/findById/:membershipId",membershipFeatureController.display_membership_feature_byid);
router.put("/update/:membershipId",membershipFeatureController.update_membership_feature);
router.delete("/delete/:membershipId",membershipFeatureController.delete_membership_feature);




module.exports = router