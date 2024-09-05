const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
        required: true,
    },
    completionStatus: {
        type: String,
        enum: ['Completed', 'Not Completed'],
        default: 'Not Completed',
    },
    grade: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'F'],
        required: function () {
            return this.completionStatus === 'Completed';
        },
    },
    remarks: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Report', reportSchema);
