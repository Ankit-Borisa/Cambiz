const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Define the base URL for your uploads


const storage = multer.memoryStorage();

const uploads = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    const allowedExtensions = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.svg', '.webp' ];
      
    console.log('Only JPG, JPEG, SVG, WEBP, and PNG files are supported!');

    // Check if the file extension is in the allowed extensions list
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

    if (isValidExtension) {
      callback(null, true);
    } else {
      console.log('only jpg, jpeg, svg, webp, and png files are supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed)
  }
});

module.exports = uploads;
