const router = require("express").Router();
const package_booking_controller = require("../controllers/package_booking_controller");



router.post("/create", package_booking_controller.createPackageBooking);
router.get("/displayById", package_booking_controller.displayById)
router.get("/display", package_booking_controller.display)

router.get("/showRemainingDays", package_booking_controller.showRemainingDays);



module.exports = router