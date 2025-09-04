const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/salesUploadPdf'); // Ensure 'uploads/' directory exists
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        let filename = Date.now() + ext;
        cb(null, filename);

        // Generate the full URL for the uploaded file
        req.fileURL =  filename; // Attach the file URL to the request object
    }
});

const uploads = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const allowedExtensions = ['.pdf', '.PDF', '.jpg', '.png', '.jpeg'];

        console.log('only pdf files are supported!');

        // Check if the file extension is in the allowed extensions list
        const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

        if (isValidExtension) {
            callback(null, true);
        } else {
            console.log('only PDF files are supported!');
            callback(null, false);
        }
    }
})

const salesPdf = uploads.fields([
    { name: "upload_po", maxCount: 1 },
    { name: "upload_COA", maxCount: 1 },
    { name: "upload_sign ", maxCount: 1 },
    { name: "upload_stamp", maxCount: 1 }
]);


module.exports = salesPdf