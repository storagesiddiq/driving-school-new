const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
    }],
    drivingSchool: {
        type: mongoose.Schema.ObjectId,
        ref: 'drivingSchool',
    },
    experience: {
        type: Number, // Years of experience
        required: true,
    },
    
    bio: {
        type: String, // Short bio or description about the instructor
        maxlength: 500,
    },
    attendance: [{
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            default: 'Absent',
        },
        recordedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value);
                    return user && user.role === 'owner';
                },
                message: 'Assigned user is not an owner',
            },
        }
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Instructor', instructorSchema);
