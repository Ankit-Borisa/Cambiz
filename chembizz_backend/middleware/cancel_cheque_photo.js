const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Define the base URL for your uploads
const baseURL = ''; // Define the provided base URL here

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'cancel_cheque_photo'); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    let filename = Date.now() + ext;
    cb(null, filename);

    // Generate the full URL for the uploaded file
    req.fileURL = baseURL + filename; // Attach the file URL to the request object
  }
});

const uploads = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    const allowedExtensions = ['.png', '.jpg', '.jpeg','.PNG','.JPG','.JPEG'];
      
    console.log('Only JPG, JPEG, and PNG files are supported!');

    // Check if the file extension is in the allowed extensions list
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

    if (isValidExtension) {
      callback(null, true);
    } else {
      console.log('only png, jpg, jpeg, files are supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed)
  }
});

module.exports = uploads;




