// utils/getSingleFileFromDirectory.js

const fs = require('fs');

// Utility function to get the single file name from a directory
function getSingleFileFromDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    if (files.length === 0) {
        throw new Error(`Add default image: ${directoryPath}`);
    }
    console.log(files[0]);
    return files[0]; // Return the first file
}

module.exports = getSingleFileFromDirectory;
