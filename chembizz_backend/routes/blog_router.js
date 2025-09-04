const router = require("express").Router();
const blogController = require("../controllers/blog_controller");

const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/Png"

        ) {
            callback(null, true);
        } else {
            console.log('only jpg, jpeg, and png files are supported!');
            callback(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed)
    }
});



router.post("/insert", upload.single('photo'), blogController.createBlog)
router.get("/display", blogController.displayBlogs)
router.get("/displayById/:id", blogController.displayBlogById)
router.put("/update/:id", upload.single('photo'), blogController.updateBlog)
router.delete("/delete/:id", blogController.deleteBlog);


module.exports = router