const express = require("express");
const messageController = require("../controllers/messageController.js");
// const protectRoute = require("../middleware/admin-user-auth.js");

const router = express.Router();

router.get("/messages/:id", messageController.getMessages);
router.post("/send/:receiverId", messageController.sendMessage);

module.exports = router;