
const User = require("../models/UserModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const sendToken = require("../utils/jwt");
const { getImageUrl, deleteImage } = require('../utils/handleImageUrl');
const path = require('path');
const errorHandler = require('../utils/errorHandler')
const sendEmail = require('../utils/email')
const crypto = require('crypto')
const Learner = require('../models/learnerModel')
const getLocation = require('../utils/getLocation')
const {Session} = require('../models/courseModel');
const searchFeatures = require("../utils/searchFeature");
// To register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    try {
        const { location, name, email, password, phoneNumber, role } = req.body;

        if (!name || !email || !password) {
            return next(new errorHandler("Please provide name, email, and password", 400));
        }

        if (role === "learner" && !location) {
            return next(new errorHandler("Please provide location for learners", 400));
        }

        // Create user in the database
        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role
        });

        // If the user is a learner, create a learner record
        if (role === "learner") {
            const learner = await Learner.create({
                user: user._id,
                location,
            });
        }

        sendToken(user, 201, res);
    } catch (error) {
        return next(error);
    }
});


//To Login user = /api/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new errorHandler('Please enter email & password', 400))
    }

    //finding the user data from Database 
    //*password field is not here bcoz we have hide password in userModel that's why we select  +password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new errorHandler('Invalid email or password', 401))
    }

    if (! await user.isValidPassword(password)) {
        return next(new errorHandler('Invalid email or password', 401))
    }

    await sendToken(user, 201, res)
})

//To logout User = /api/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Logged Out"
        })
}

//Get User Profile - api/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new errorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new errorHandler("Server error", 500));
    }
});

//update Profile - api/update-profile/:id
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        ...req.body
    };

    let avatar = null;

    const existuser = await User.findById(req.user.id);
    if (!existuser) {

        return res.status(404).json({
            success: false,
            error: 'User not found',
        });
    }

    // Check if req.file exists to update avatar
    if (req.file) {
        const oldAvatar = path.join(__dirname, '..', 'uploads/user', path.basename(existuser.avatar));
        deleteImage(oldAvatar);
        // Get the URL for the new image
        avatar = getImageUrl(req, req.file, 'user');
    } else {
        // If no new image is uploaded, keep the old image
        avatar = existuser.avatar;
    }

    newUserData.avatar = avatar;


    // Update user in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, // Return the updated user object
        runValidators: true // Run validators on update
    });
    await user.save()

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    res.status(200).json({
        success: true,
        user
    });
});

//Forgot password by entering ur email in body = /api/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    //get user by email
    const user = await User.findOne({ email: req.body.email })

    //If email is not in DB
    if (!user) {
        return next(new errorHandler('Invalid Email ID', 404))
    }

    //If email is correct then generate reset token
    const resetToken = user.getResetToken()
    await user.save({ validateBeforeSave: false })

    let BASE_URL = `${process.env.FRONTEND_URL}`

    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    //Create reset URL
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`
    console.log(resetToken)
    //Create email message
    const message = `Your password reset url is as follows \n\n
                     ${resetUrl}  \n\n If you have not requested this email, then ignore it.`

    //sending email to reset password
    try {

        await sendEmail({
            email: user.email,
            subject: "Driving School Password Recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new errorHandler(error.message), 500)
    }
})

//reset password by passing password and confirmPassword in body = api/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //get user data by user resetPasswordToken
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new errorHandler('Password reset token is invalid or expired', 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler('Password does not match', 404))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined
    await user.save({ validateBeforeSave: false })

    sendToken(user, 201, res)
})

//get user current location = save it in session Storage then use
exports.getUserLocation = catchAsyncError(async (req, res, next) => {
    try {
        const { lat, long } = req.body
        if (!lat || !long || isNaN(lat) || isNaN(long)) {
            return next(new errorHandler("Invalid latitude or longitude", 404));
        }

        const location = await getLocation(lat, long)

        if (!location || location === false) {
            return res.status(400).json({
                success: false,
                location
            });
        }

        res.status(200).json({
            success: true,
            location
        });
    } catch (error) {
        return next(new errorHandler("Unable to fetch location details", 500));
    }
})

// Endpoint to handle heartbeat
exports.getActiveHeartbeat = catchAsyncError(async (req, res) => {

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Update last activity timestamp
        user.lastActivity = Date.now();
        await user.save();

        res.status(200).json({ success: true, message: 'Heartbeat received' });
    } catch (error) {
        console.error('Error updating user activity:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

exports.getMatchUsers = catchAsyncError(async (req, res, next) => {
    let sessions;

    // Find the current user
    const currUser = await User.findById(req.user.id);
    if (!currUser) {
        return next(new Error(`User not found with id ${req.user.id}`));
    }

    // Determine the user's role and fetch the corresponding sessions
    if (currUser.role === 'instructor') {
        // If the user is an instructor, find sessions where they are the instructor and populate learners
        sessions = await Session.find({ instructor: req.user.id })
            .populate('learner', 'avatar name email');
    } else if (currUser.role === 'learner') {
        // If the user is a learner, find sessions where they are the learner and populate instructors
        sessions = await Session.find({ learner: req.user.id })
            .populate('instructor', 'avatar name email');
    } else {
        return next(new Error('Unauthorized access - invalid role.'));
    }

    // Extract and format the learners or instructors based on the user's role
    const relatedUsers = sessions.map(session => {
        return currUser.role === 'instructor' ? session.learner : session.instructor;
    });

    // Create a query to filter the related users based on search features
    let query = User.find({ _id: { $in: relatedUsers.map(user => user._id) } });

    const features = new searchFeatures(query, req.query).userSearch();

    // Execute the filtered query
    const matchedUsers = await features.exec();

    res.status(200).json({
        success: true,
        count: matchedUsers.length,
        users: matchedUsers
    });
});

