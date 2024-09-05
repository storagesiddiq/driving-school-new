const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');
const { hash } = require('./hashing');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3001/api/auth/google/callback`,
    passReqToCallback: true, // Ensure that req is passed as the first argument
    scope: ['profile', 'email']
},
async (req, accessToken, refreshToken, profile, done) => { // Added req as the first argument
    try {
        // Check if the profile object has emails
        if (!profile.emails || !profile.emails.length) {
            throw new Error('No email found in the user profile');
        }

        const userEmail = profile.emails[0].value;

        // Check if a user with the email already exists
        const existingUser = await User.findOne({ email: userEmail });

        if (existingUser) {
            // Update the user's Google ID if they already exist
            existingUser.googleId = hash(profile.id.toString());
            existingUser.name = profile.displayName;
            existingUser.avatar = profile._json.picture;

            await existingUser.save();
            return done(null, existingUser); // Ensure done is correctly called
        }

        // If no user exists, create a new one
        const newUser = new User({
            googleId: hash(profile.id.toString()), // Use the hash function correctly
            name: profile.displayName,
            email: userEmail,
            avatar: profile._json.picture,
            role:'learner'
        });

        await newUser.save();
        done(null, newUser); // Ensure done is correctly called
    } catch (error) {
        console.error('Error in Google OAuth:', error);
        done(error); // Ensure done is correctly called with error
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
