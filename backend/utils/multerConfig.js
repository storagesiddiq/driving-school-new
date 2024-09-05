const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createMulterInstance = (folderName, allowVideo = false) => {
  // Ensure the directory exists
  const uploadFolder = path.join(__dirname, '..', 'uploads', folderName);
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      // Create a unique filename using the original name and timestamp
      cb(null, file.originalname.replace(/\.[^/.]+$/, "") + '_' + Date.now() + path.extname(file.originalname));
    },
  });

  const maxSize = allowVideo ? 50 * 1000 * 1000 : 2 * 1000 * 1000; // 2 MB

  const fileFilter = (req, file, cb) => {
    let fileTypes;
    if (allowVideo) {
      fileTypes = /jpeg|jpg|png|webp|mp4|avi|mov|mkv/; // Allow video formats
    } else {
      fileTypes = /jpeg|jpg|png|webp/; // Only image formats
    }

    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Error: File type should be: " + fileTypes));
  };

  return multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter,
  });
};

module.exports = createMulterInstance;
