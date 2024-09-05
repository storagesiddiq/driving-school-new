const catchAsyncError = require('../middlewares/catchAsyncError');
const Vehicle = require('../models/vehicleModel'); 
const {Course} = require('../models/courseModel')
const errorHandler = require('../utils/errorHandler')

// Create a new vehicle
exports.createVehicle = catchAsyncError(async (req, res, next) => {
    const { name, registrationNumber, type, lastServiceDate, nextServiceDate, availability, certificates } = req.body;

    const vehicle = await Vehicle.create({
        name,
        registrationNumber,
        type,
        lastServiceDate,
        nextServiceDate,
        availability,
        certificates,
    });

    res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        vehicle,
    });
});

// Get all vehicles
exports.getAllVehicles = catchAsyncError(async (req, res, next) => {
    const vehicles = await Vehicle.find();

    res.status(200).json({
        success: true,
        vehicles,
    });
});

// Get vehicle by ID
exports.getVehicleById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
        return next(new errorHandler('Vehicle not found', 404));
    }

    res.status(200).json({
        success: true,
        vehicle,
    });
});

// Update vehicle
exports.updateVehicle = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, registrationNumber, type, lastServiceDate, nextServiceDate, availability, certificates } = req.body;

    let vehicle = await Vehicle.findById(id);

    if (!vehicle) {
        return next(new errorHandler('Vehicle not found', 404));
    }

    vehicle.name = name || vehicle.name;
    vehicle.registrationNumber = registrationNumber || vehicle.registrationNumber;
    vehicle.type = type || vehicle.type;
    vehicle.lastServiceDate = lastServiceDate || vehicle.lastServiceDate;
    vehicle.nextServiceDate = nextServiceDate || vehicle.nextServiceDate;
    vehicle.availability = availability || vehicle.availability;
    vehicle.certificates = certificates || vehicle.certificates;

    await vehicle.save();

    res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        vehicle,
    });
});

// Delete vehicle
exports.deleteVehicle = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
        return next(new errorHandler('Vehicle not found', 404));
    }

    // Check if the vehicle is associated with any course
    const associatedCourses = await Course.find({ vehicles: id });

    if (associatedCourses.length > 0) {
        const courseTitles = associatedCourses.map(course => course.title).join(', ');
        return next(new errorHandler(`This vehicle cannot be deleted because it is associated with the following courses: ${courseTitles}`, 400));
    }

    // If no associations are found, delete the vehicle
    await vehicle.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
    });
});

