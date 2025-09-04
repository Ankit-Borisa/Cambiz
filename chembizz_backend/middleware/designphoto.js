const multer = require("multer")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/design')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage }).single('design_photo')


module.exports = upload