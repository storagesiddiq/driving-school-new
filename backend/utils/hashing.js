const crypto = require('crypto');


exports.hash = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};