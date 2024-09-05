const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const  getSingleFileFromDirectory  = require('../utils/getSingleFileFromDirectory')
const path = require('path')

const userSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: false,
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, 'Please enter name'],
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter Email Id'],
        unique: [true, 'Duplicate Key error'],
        trim: true,
        validate: [validator.isEmail, 'Please enter valid email address'],
    },
    password: {
        type: String,
        trim: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['owner', 'learner', 'instructor', 'admin'],
        default: 'learner',  // Default role
    },
    phoneNumber: {
        type: String,
    },
    avatar: {
        type: String,
        default: function() {
            const avatarPath = path.join(__dirname, '../', 'uploads/defaultAvatar');
            const avatarFile = getSingleFileFromDirectory(avatarPath);
            return `${process.env.STATIC_URL}/uploads/defaultAvatar/${avatarFile}`;
        } 
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
}, {
    timestamps: true,
});

//middleware function to hiding(hashing) passoword
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//To generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_TIME }
    )
}

//To validate password
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//To resetPassword
userSchema.methods.getResetToken = function () {
    //generate token
    const token = crypto.randomBytes(20).toString('hex');

    //generate hash and set resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;
    return token
}


// Method to activate user
userSchema.methods.activateUser = async function () {
    this.isActive = true;
    await this.save();
};

// Method to deactivate user
userSchema.methods.deactivateUser = async function () {
    this.isActive = false;
    await this.save();
};

module.exports = mongoose.model('User', userSchema)