const router = require("express").Router();
const otpController = require("../controllers/otpController");




router.post("/send_otp", otpController.sendOtp);
router.post("/send_registion_otp", otpController.sendRegistionOtp)
router.post("/verify_otp", otpController.verify_otp);
router.post("/resend_otp", otpController.resend_otp)


module.exports = router