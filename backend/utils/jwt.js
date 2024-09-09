const sendToken = (user, statusCode, res, redirect = false) => {
    // Creating JWT Token
    const token = user.getJwtToken();

    // Setting cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'none', // Adjust this according to your CORS settings
        secure: true, // Use 'true' only in production
    };

    if (redirect) {
        // Set the cookie and redirect
        res.cookie('token', token, options).redirect(`${process.env.FRONTEND_URL}`); 
    } else {
        // Send JSON response
        res.status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                message: 'Authenticated Successfully',
                user,
                token
            });
    }
};

module.exports = sendToken;
