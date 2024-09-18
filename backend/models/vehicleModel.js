const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    drivingSchool:{
        type: mongoose.Schema.ObjectId,
        ref: 'drivingSchool',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter the vehicle name'],
        unique: true,
    },
    registrationNumber: {
        type: String,
        required: [true, 'Please enter the vehicle registration number'],
        unique: true,
    },
    type: {
        type: String,
        required: [true, 'Please specify the vehicle type'],
    },
    lastServiceDate: {
        type: Date,
        required: [true, 'Please enter the last service date'],
    },
    nextServiceDate: {
        type: Date,
        required: true,
    },
    certificates: [{
        name: String,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
