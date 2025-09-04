const router = require("express").Router();
const salesInvoiceController = require("../controllers/salesInvoiceController");
const multer = require('multer');
const path = require("path");
const { verifyToken } = require("../middleware/generateAccessToken");
// Define multer storage configuration
const storage = multer.memoryStorage();

// Set up multer upload with storage configuration and file filter
const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        // Check if the file extension is valid (pdf, jpg, jpeg, png)
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error("Please upload a valid image file"));
        }
        cb(null, true);
    }
});

// Set up multer to handle multiple file uploads with specific field names
const salesPdf = upload.fields([
    { name: "upload_po", maxCount: 1 },
    { name: "upload_COA", maxCount: 1 },
    { name: "upload_sign", maxCount: 1 },
    { name: "upload_stamp", maxCount: 1 },
    { name: "lr_copy", maxCount: 1 },
    { name: "lori_copy", maxCount: 1 },
]);

// Define routes
router.post("/insert", salesPdf, salesInvoiceController.insertSalesInvoice);
router.post("/displayList", salesInvoiceController.displayListByUser);
// po change id 
router.get("/displayDetails/:salesInvoiceId", salesInvoiceController.displayDetails)
router.put("/updatepo", salesInvoiceController.updatePo);
// for cancel the po
router.post("/cancelPo",verifyToken,salesInvoiceController.cancelPo)
//po change table
router.post("/po_and_invoice_details", salesInvoiceController.displayPoAndInvoiceDetails)
router.put("/update_lr_copy/:id", salesPdf, salesInvoiceController.updateLrCopy)
router.put("/update_lori_copy/:id", salesPdf, salesInvoiceController.updateLoriCopy)
router.get("/polist", salesInvoiceController.displayPoList)
router.get("/invoicelist", salesInvoiceController.displayInvoiceList)

module.exports = router;
