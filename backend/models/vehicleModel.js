const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
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
        enum: ['Two Wheeler with Gear', 'Two Wheeler without Gear', 'Three Wheeler', 'Four Wheeler'],
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
