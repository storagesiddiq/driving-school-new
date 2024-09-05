const mongoose = require('mongoose');
const User = mongoose.model('User');
const DrivingSchool = mongoose.model('drivingSchool');

// Get number of active users
const getActiveLearners = async () => {
    return User.countDocuments({ isActive: true, role: 'learner'});
};

// Get total number of learners
const getTotalLearners = async () => {
    return User.countDocuments({ role: 'learner' });
};

// Get total number of instructors
const getTotalInstructors = async () => {
    return User.countDocuments({ role: 'instructor' });
};

// Get total number of drivingSchool
const getTotalSchools = async () => {
    return DrivingSchool.countDocuments();
};

module.exports = {
    getActiveLearners,
    getTotalLearners,
    getTotalInstructors,
    getTotalSchools
};
