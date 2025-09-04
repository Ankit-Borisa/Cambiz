const router = require("express").Router();
const trasaction_controller = require("../controllers/transactionController");



router.post("/pay", trasaction_controller.initiate_payment);
router.get("/payment_status", trasaction_controller.getPaymentStatus);




module.exports = router