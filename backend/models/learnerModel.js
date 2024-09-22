const mongoose = require('mongoose')

const learnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'learner';
            },
            message: 'Assigned user is not a learner',
        },
    },
    courses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
    }],
    attendance: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Attendance',
    }],
    location: {
        type: String,
    },
    dateOfBirth: { type: Date },
    address: { type: String },
    isDrivingLicense: { type: Boolean },
    driversLicenseNumber: { type: String },
    idProofNo: { type: String },
    parentGuardianInfo: {
        name: { type: String },
        phoneNumber: { type: String }
    }

}, {
    timestamps: true,
});

module.exports = mongoose.models.Learner || mongoose.model('Learner', learnerSchema);
