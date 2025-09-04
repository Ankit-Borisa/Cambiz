const router = require("express").Router();
const inquiry_status_controller = require("../controllers/inquiry_status_controller");





router.post("/inquiry_status", inquiry_status_controller.insertStatus)
router.get("/inquiry_status_display/:inquiry_id", inquiry_status_controller.displayInquiryStatus)


module.exports = router