const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
        required: true,
    },
    learner:  {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'learner';
            },
            message: 'Assigned user is not an learner',
        },
    },
    instructor:  {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'instructor';
            },
            message: 'Assigned user is not an instructor',
        },
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'idle'],
        default: 'Absent',
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
