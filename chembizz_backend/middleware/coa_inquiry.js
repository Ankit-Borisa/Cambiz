const path = require('path');
const multer = require('multer');
 // Define the provided base URL here
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'coa_inquiry'); // Ensure 'coa/' directory exists
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname); // Extract the file extension
    let uniqueFilename = Date.now() + ext; // Generate a unique filename using the current timestamp and the original file extension
    let fullURL = uniqueFilename; // Concatenate the base URL with the unique filename
    cb(null, uniqueFilename); // Pass the unique filename to multer
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    const allowedExtensions = ['.pdf','.PDF']; // Define the list of allowed file extensions

    // Check if the file extension is in the allowed extensions list
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

    if (isValidExtension) {
      callback(null, true); // If the file extension is valid, accept the file
    } else {
      console.log('only pdf files are supported!'); // Log a message indicating that only specific file types are supported
      callback(null, false); // If the file extension is not valid, reject the file
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

module.exports = upload; 