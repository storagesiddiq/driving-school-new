const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');
const Learner = require('../models/learnerModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3001/api/auth/google/callback`,
    passReqToCallback: true,
    scope: ['profile', 'email']
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Check if the profile object has emails
        if (!profile.emails || !profile.emails.length) {
            throw new Error('No email found in the user profile');
        }

        const userEmail = profile.emails[0].value;

        // Check if a user with the email already exists
        let user = await User.findOne({ email: userEmail });

        if (user) {
            // Update the user's Google ID if they already exist
            user.googleId = profile.id;
            user.name = profile.displayName;
            user.avatar = profile._json.picture;
            await user.save();
        } else {
            // If no user exists, create a new one
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: userEmail,
                avatar: profile._json.picture,
                role: 'learner'
            });
            await user.save();
        }

        // Create a new Learner if the user is not already associated with one
        let learner = await Learner.findOne({ user: user._id });
        if (!learner) {
            learner = new Learner({ user: user._id });
            await learner.save();
        }

        done(null, user);
    } catch (error) {
        console.error('Error in Google OAuth:', error);
        done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});
