const router = require("express").Router()
const bookingController = require("../controllers/bookingController")


router.post('/insert',bookingController.insertBooking)
router.get("/display",bookingController.displayBooking)


module.exports = router