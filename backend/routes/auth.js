const express = require('express')
const router = express.Router()
const Auth = require('../controllers/authController')
const passport = require('passport');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendToken = require('../utils/jwt');
const createMulterInstance = require('../utils/multerConfig');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')

// Google Authentication
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth Callback Route
router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    catchAsyncError(async (req, res) => {
        // Generate and send JWT token after successful authentication
        console.log("AUTH SUCCESSFULLY!!");
        console.log(req.user)
        console.log(req)
        sendToken(req.user, 200, res,redirect=true);
    })
);

// Create multer instance for 'category' uploads
const upload = createMulterInstance('user');


router.route('/register').post(Auth.registerUser)
router.route('/login').post(Auth.loginUser)
router.route('/logout').get(Auth.logoutUser)
router.route('/myprofile').get(isAuthenticatedUser, Auth.getUserProfile)
router.route('/update').put(isAuthenticatedUser,upload.single('avatar'), Auth.updateProfile)
router.route('/password/forgot').post(Auth.forgotPassword)
router.route('/password/reset/:token').post(Auth.resetPassword)
router.get('/location',isAuthenticatedUser, Auth.getUserLocation)

router.get('/user/heartbeat',isAuthenticatedUser, Auth.getActiveHeartbeat)
router.get('/matched-users',isAuthenticatedUser, Auth.getMatchUsers) 

module.exports = router