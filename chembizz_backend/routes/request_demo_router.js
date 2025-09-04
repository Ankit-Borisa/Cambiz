const router = require("express").Router();
const request_demo_controller = require("../controllers/request_demo_controller");




router.post("/create", request_demo_controller.newRequestDemo);
router.put("/update/:id", request_demo_controller.updateRequestDemo);
router.get("/getAll", request_demo_controller.getAllRequestDemos);
router.get("/getById/:id", request_demo_controller.getRequestDemoById);



module.exports = router