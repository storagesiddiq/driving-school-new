const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    drivingSchool:{
        type: mongoose.Schema.ObjectId,
        ref: 'drivingSchool',
        required: true,
    },
    serviceName: {
        type: String,
        required: [true, 'Please enter the service name'],
    },
    serviceType: {
        type: String,
        enum: ['Registration', 'Renewal'],
        required: [true, 'Please specify the type of service'],
    },
    vehicleType: {
        type: String,
        enum: ['Two Wheeler with Gear', 'Two Wheeler without Gear', 'Three Wheeler', 'Four Wheeler'],
        required: [true, 'Please specify the vehicle type'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the service'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter the service fee'],
    },
    certificatesIssued: [{
        type: String, // e.g., 'Driving License', 'Renewal Certificate'
        required: true,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
