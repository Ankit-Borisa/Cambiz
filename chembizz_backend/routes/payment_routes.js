const router = require("express").Router();
const paymentController = require("../controllers/paymentController");



router.post("/insertPayment", paymentController.insertPayment);
router.get("/displayList", paymentController.displayList);
router.get("/paymentList", paymentController.allPaymentList);







module.exports = router