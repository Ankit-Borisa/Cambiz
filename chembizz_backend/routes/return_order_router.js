const router = require("express").Router();
const return_order_controller = require("../controllers/return_order_controller");




router.post("/create_return_order", return_order_controller.create_return_order);
router.get("/displayList/:request_type", return_order_controller.displayList);



module.exports = router