const router = require("express").Router();
const subscriber_controller = require("../controllers/subscriber_controller");




router.post("/add", subscriber_controller.addSubscriber);
router.get("/display", subscriber_controller.getAllSubscriber)


module.exports = router