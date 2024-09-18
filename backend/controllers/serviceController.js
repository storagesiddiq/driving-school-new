const catchAsyncError = require('../middlewares/catchAsyncError');
const Service = require('../models/serviceModel'); // Adjust path as necessary
const errorHandler = require('../utils/errorHandler');
const {Course} = require('../models/courseModel')
const DrivingSchool = require('../models/drivingSchoolModel')

// Create a new service
exports.createService = catchAsyncError(async (req, res, next) => {
    const { serviceName, serviceType, vehicleType, description, price, certificatesIssued } = req.body;

    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    const service = await Service.create({
        drivingSchool:drivingSchool._id,
        serviceName,
        serviceType,
        vehicleType,
        description,
        price,
        certificatesIssued,
    });

    res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service,
    });
});

// Get all services
exports.getAllServices = catchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }
    const services = await Service.find({drivingSchool:drivingSchool._id});

    res.status(200).json({
        success: true,
        services,
    });
});

// Get service by ID
exports.getServiceById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
        return next(new errorHandler('Service not found', 404));
    }

    res.status(200).json({
        success: true,
        service,
    });
});

// Update service
exports.updateService = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { serviceName, serviceType, vehicleType, description, price, certificatesIssued } = req.body;

    let service = await Service.findById(id);

    if (!service) {
        return next(new errorHandler('Service not found', 404));
    }

    service.serviceName = serviceName || service.serviceName;
    service.serviceType = serviceType || service.serviceType;
    service.vehicleType = vehicleType || service.vehicleType;
    service.description = description || service.description;
    service.price = price || service.price;
    service.certificatesIssued = certificatesIssued || service.certificatesIssued;

    await service.save();

    res.status(200).json({
        success: true,
        message: 'Service updated successfully',
        service,
    });
});

// Delete service
exports.deleteService = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
        return next(new errorHandler('Service not found', 404));
    }
    const associatedCourses = await Course.find({ services: id });

    if (associatedCourses.length > 0) {
        const courseTitles = associatedCourses.map(course => course.title).join(', ');
        return res.status(400).json({
            success: true,
            message: `This service cannot be deleted because it is associated with the following courses: ${courseTitles}`,
        }); 
            }
    await service.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Service deleted successfully',
    });
});
