const router = require("express").Router();
const myDesignController = require("../controllers/myDesignController");



router.post("/create", myDesignController.createMyDesign)
router.get("/displayList", myDesignController.displayList)
router.delete("/remove/:id", myDesignController.removeMyDesign)
router.put("/update/:id", myDesignController.editMyDesign)
router.get("/displayDetails", myDesignController.myDesignDisplayByToken)


module.exports = router