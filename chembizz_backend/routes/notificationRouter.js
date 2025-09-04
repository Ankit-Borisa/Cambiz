const express = require('express'); // Import express framework
const router = express.Router()
const notificationController = require("../controllers/notificationController");




router.get("/display", notificationController.displayNotification)
router.put("/update", notificationController.notificationUpdate)


module.exports = router