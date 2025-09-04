const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    const allowedExtensions = ['.pdf','.PDF']; // Define the list of allowed file extensions

    // Check if the file extension is in the allowed extensions list
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

    console.log("using coa multer")

    if (isValidExtension) {
      callback(null, true); // If the file extension is valid, accept the file
    } else {
      console.log('only pdf files are supported!'); // Log a message indicating that only specific file types are supported
      callback(null, false); // If the file extension is not valid, reject the file
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed). Define the file size limit for uploads
  }
});

module.exports = upload; // Export the configured multer instance for use in other modules
