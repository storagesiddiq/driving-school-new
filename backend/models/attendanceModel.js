const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
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
