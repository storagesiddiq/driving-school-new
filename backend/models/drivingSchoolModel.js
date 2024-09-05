const mongoose = require('mongoose');
const getSingleFile = require('../utils/getSingleFileFromDirectory')
const path = require('path')

const drivingSchoolSchema = new mongoose.Schema({
    bannerImg:{
        type:String,
        default: function() {
            const bannerPath = path.join(__dirname,'../', 'uploads/defaultBanner');
            const bannerFile = getSingleFile(bannerPath);
            return `${process.env.STATIC_URL}/uploads/defaultBanner/${bannerFile}`;
        }
    },
    avatar:{
        type:String,
        default: function() {
            const avatarPath = path.join(__dirname,'../', 'uploads/defaultAvatar');
            console.log(avatarPath)
            const avatarFile = getSingleFile(avatarPath);
            return `${process.env.STATIC_URL}/uploads/defaultAvatar/${avatarFile}`;
        }
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    drivingSchoolName: {
        type: String,
        required: true,
    },
    about:{
        type: String,
    },
    location:{
        type: String,
    },

    // instructors: [
    //     {
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'User',
    //         validate: {
    //             validator: async function (value) {
    //                 const user = await mongoose.model('User').findById(value);
    //                 return user && user.role === 'instructor';
    //             },
    //             message: 'Assigned user is not an instructor',
    //         },
    //     }
    // ],
    // courses: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Course',
    // }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('drivingSchool', drivingSchoolSchema)