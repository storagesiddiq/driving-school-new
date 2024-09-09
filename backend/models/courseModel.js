const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    learner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'learner';
            },
            message: 'Assigned user is not a learner',
        },
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'instructor';
            },
            message: 'Assigned user is not an instructor',
        },
    },
    startDate: {
        type: Date,
        required: true,
        get: function(value) {
            return value.toISOString().split('T')[0]; // Returns only the date part
        }
    },
    endDate: {
        type: Date,
        required: true,
        get: function(value) {
            return value.toISOString().split('T')[0]; // Returns only the date part
        }
    },
    startTime: {
        type: String,  // Store as a string like "11:00 AM"
        required: true,
    },
    endTime: {
        type: String,  // Store as a string like "2:00 PM"
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const registerlearnerSchema = new mongoose.Schema({
    drivingSchool:{
        type: mongoose.Schema.ObjectId,
        ref: 'drivingSchool',
        required: true,
    },
    course:{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    learner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
});

const courseSchema = new mongoose.Schema({
    drivingSchool:{
        type: mongoose.Schema.ObjectId,
        ref: 'drivingSchool',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter course title'],
    },
    vehicles: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Vehicle',
        }
    ],
    services: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Service',
        }
    ],
    description: {
        type: String,
        required: [true, 'Please enter course description'],
    },
    duration: {
        type: Number,
        required: [true, 'Please enter course duration (in weeks)'],
    },
    instructor: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value);
                    return user && user.role === 'instructor';
                },
                message: 'Assigned user is not an instructor',
            },
        }
    ],
    ratings: {
        type: String,
        default: 0
    },
    reviews: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
    ],
    learners: [registerlearnerSchema],
    sessions: [ 
         {type: mongoose.Schema.ObjectId,
        ref: 'Session',}],
},
    {
        timestamps: true
    });

// Export models
const Course = mongoose.model('Course', courseSchema);
const registerLearner = mongoose.model('regLearner', registerlearnerSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = { Course, registerLearner, Session };