const router = require("express").Router();
const expireController = require("../controllers/expireController");



router.post("/insert", expireController.insertExpire)
router.get("/display", expireController.displayExpireData);
router.put("/edit/:expireId", expireController.editExpireData)




module.exports = router