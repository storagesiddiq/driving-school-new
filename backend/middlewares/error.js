module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    let message = err.message || 'Internal Server Error';
    
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(value => value.message).join(', ');
    } else if (err.name === 'CastError') {
        message = `Resource not found: ${err.path}`;
    } else if (err.code === 11000) {
        message = `Duplicate key error: ${Object.keys(err.keyValue).join(', ')}`;
    } else if (err.name === "JSONWebTokenError") {
        message = `Invalid JSON Web Token. Try again.`;
    } else if (err.name === "TokenExpiredError") {
        message = `JSON Web Token has expired. Try again.`;
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        message = `Unexpected file upload limit.`;
    } else if (err.code === "LIMIT_FILE_SIZE") {
        message = `File size exceeds the 2MB limit.`;
    }
    
    res.status(err.statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            error: err
        })
    });
};
