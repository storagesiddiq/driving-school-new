const mongoose = require('mongoose')

const learnerSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require:true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'learner';
            },
            message: 'Assigned user is not an learner',
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
    location:{
        type:String,
        require:true
    }
},{
    timestamps: true,
});

module.exports = mongoose.models.Learner || mongoose.model('Learner', learnerSchema);
