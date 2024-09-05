const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'instructor' || user.role === 'learner';
            },
            message: 'Assigned user is not an instructor/learner',
        },
    }],
    chatName: {
        type: String
    },
    latestMessage: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Message'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Chat', chatSchema);
