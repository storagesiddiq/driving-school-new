const sendToken= (user, statusCode, res)=>{
    //creating JWT Token
    const token = user.getJwtToken()

    //setting cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
        sameSite: 'none', // Adjust this according to your CORS settings
        secure: true, // Use 'true' if your application is served over HTTPS
    }

    res.status(statusCode)
    .cookie('token',token, options)
    .json({
        success: true,
         message: 'Authenticate Successfully',
        user,
        token
    })
}

module.exports = sendToken