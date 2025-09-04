const path = require('path');
const multer = require('multer');


const storage = multer.memoryStorage();

const uploads = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    const allowedExtensions = ['.pdf'];
      
    console.log('only pdf files are supported!');

    // Check if the file extension is in the allowed extensions list
    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname));

    if (isValidExtension) {
      callback(null, true);
    } else {
      console.log('only PDF files are supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed)
  }
});

module.exports = uploads;


// const path = require('path');
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'doc/'); // Ensure 'uploads/' directory exists
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   }
// });

// const allowedExtensions = ['.pdf'];

// const fileFilter = function (req, file, callback) {
//   // Check if the file extension is in the allowed extensions list
//   const isValidExtension = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());

//   if (isValidExtension) {
//     callback(null, true);
//   } else {
//     console.log('only pdf files are supported!');
//     callback(null, false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // 5 MB (adjust as needed)
//   }
// });

// module.exports = upload;
