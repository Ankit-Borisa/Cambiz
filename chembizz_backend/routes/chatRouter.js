const express = require('express'); // Import express framework
const router = express.Router();
const chatController = require("../controllers/chatController");




router.post("/insert-chat", chatController.insertChat);
router.get("/display/:inquiryId", chatController.displayChatByInquiry)

router.put("/update-status/:negotiationId", chatController.updateStatus)

router.get("/displayNegotation/:inquiryId", chatController.negotationDisplayByCompany);

router.get("/messages/:id", chatController.getMessages)

module.exports = router