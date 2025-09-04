const router = require("express").Router();
const contactMessageController = require("../controllers/contact_message_controller");




router.post("/add", contactMessageController.addMessage);
router.get("/display", contactMessageController.getAllMessage);


module.exports = router


