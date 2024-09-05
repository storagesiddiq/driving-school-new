const crypto = require('crypto')

exports.generateRandomPassword = () => {
    return crypto.randomBytes(5).toString('hex'); // Generates a 10-character string
};