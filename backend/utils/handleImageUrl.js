// utils/imageUtils.js
const path = require('path');
const fs = require('fs');

// Function to generate the image URL
exports.getImageUrl = (req, file, foldername) => {
    let BASE_URL = process.env.STATIC_URL;

    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    // Construct URL based on the file's name
    return file ? `${BASE_URL}/uploads/${foldername}/${path.basename(file.path)}`: null;
};

// Function to delete an image file
exports.deleteImage = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

