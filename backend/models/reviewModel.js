const mongoose=require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'learner';
            },
            message: 'Assigned user is not an learner',
        },
    },
    rating: {
        type: String,
        required: true,
    },
    comment: {
        type: String
    }
})

module.exports = mongoose.model('Review',reviewSchema )
