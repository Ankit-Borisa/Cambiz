const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploadss'); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"||
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

module.exports = upload;
