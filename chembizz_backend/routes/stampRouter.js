const express = require("express");
const router = express.Router();
const multer = require("multer");
const stampController = require("../controllers/stampController");




// Multer configuration for file upload
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a valid image file"));
        }
        cb(null, true);
    }
});

// upload.fields([{ name: "stampImage", maxCount: 1 }, { name: "signImage", maxCount: 1 }]);


// Upload a single image to stamp image and sign image
router.post("/insert-stamp", upload.fields([{ name: "stampImage", maxCount: 1 }, { name: "signImage", maxCount: 1 }]), stampController.insertStamp);

router.get('/stamp',  stampController.displaystamp);


router.put("/update/:stampId",upload.fields([{ name: "stampImage", maxCount: 1 }, { name: "signImage", maxCount: 1 }]),stampController.updateStamp)



module.exports = router;
