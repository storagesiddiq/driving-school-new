const catchAsyncError = require("../middlewares/catchAsyncError");
const DrivingSchool = require("../models/drivingSchoolModel");
const { Course } = require("../models/courseModel");
const errorHandler = require("../utils/errorHandler");
const Instructor = require("../models/instructorModel");
const Vechicles = require('../models/vehicleModel')

//Get ALl courses
exports.getAllCourses = catchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    // Find all courses associated with the driving school
    const courses = await Course.find({ drivingSchool: drivingSchool._id })
        .populate('vehicles', 'vehicleName vehicleType')
        .populate('services', 'serviceName description')
        .populate('instructor', 'name email')
        .populate('learners', 'learnerName learnerEmail')
        .populate('reviews', 'rating comment');

    // Calculate total members for learners, services, and vehicles for each course
    const coursesWithTotals = courses.map(course => {
        const totalLearners = course.learners.length;
        const totalServices = course.services.length;
        const totalVehicles = course.vehicles.length;

        return {
            ...course.toObject(),
            totalLearners,
            totalServices,
            totalVehicles
        };
    });

    // Respond with the courses and their totals
    res.status(200).json({
        success: true,
        courses: coursesWithTotals
    });
});

//Get Course By ID
exports.getCourseById = catchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    // Find the course by ID and populate related fields
    const course = await Course.findOne({ _id: req.params.id, drivingSchool: drivingSchool._id })
        .populate('vehicles', 'name registrationNumber type lastServiceDate nextServiceDate usedInCourses  certificates ')
        .populate('services', 'serviceName serviceType vehicleType price certificatesIssued description')
        .populate('instructor', 'name email')
        .populate('learners', 'learnerName learnerEmail')
        .populate('sessions', 'sessionDate sessionTime sessionInstructor')
        .populate('reviews', 'rating comment reviewerName');

    if (!course) {
        return next(new errorHandler('Course not found or does not belong to your Driving School', 404));
    }

    // Calculate totals
    const totalLearners = course.learners.length;
    const totalServices = course.services.length;
    const totalVehicles = course.vehicles.length;
    const totalSessions = course.sessions.length;
    const totalReviews = course.reviews.length;

    // Respond with the course details and totals
    res.status(200).json({
        success: true,
        course: {
            ...course.toObject(),
            totalLearners,
            totalServices,
            totalVehicles,
            totalSessions,
            totalReviews,
        }
    });
});

//Create Course = instructor is instructor _id it's instructor.instructor
exports.createCourse = catchAsyncError(async (req, res, next) => {
    const {
        title,
        vehicles,
        services,
        description,
        duration,
        instructor,
    } = req.body;

    // Check if the driving school is owned by the logged-in user
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    // Check if instructors are provided
    if (!instructor || instructor.length === 0) {
        return next(new errorHandler('Course should have at least one instructor, please select an instructor', 400));
    }

    // Validate that instructors are associated with the current driving school
    const validInstructors = await Instructor.find({
        instructor: { $in: instructor },
        drivingSchool: drivingSchool._id
    });

    if (validInstructors.length !== instructor.length) {
        return next(new errorHandler('One or more instructors are invalid or do not belong to your Driving School', 400));
    }

    // Create a new course
    const course = await Course.create({
        drivingSchool: drivingSchool._id,
        title,
        vehicles,
        services,
        description,
        duration,
        instructor,
    });

    // Add the course ID to each valid instructor's courses array
    await Promise.all(validInstructors.map(async (inst) => {
        inst.courses.push(course._id);
        await inst.save();
    }));
    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course
    });
});

//Delete Course
exports.deleteCourse = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    const course = await Course.findOne({ _id: id, drivingSchool: drivingSchool._id });

    if (!course) {
        return next(new errorHandler('Course not found or does not belong to your Driving School', 404));
    }

    // Remove the course ID from the instructors' courses array
    await Promise.all(course.instructor.map(async (instId) => {
        const inst = await Instructor.findOne({instructor:instId});
        inst.courses.pull(course._id);
        await inst.save();
    }));

    // Delete the course
    await course.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
    });
});

//update Course
exports.updateCourse = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { title, vehicles, services, description, duration, instructor } = req.body;

    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    let course = await Course.findOne({ _id: id, drivingSchool: drivingSchool._id });

    if (!course) {
        return next(new errorHandler('Course not found or does not belong to your Driving School', 404));
    }

    // Check if instructors are provided
    if (!instructor || instructor.length === 0) {
        return next(new errorHandler('Course should have at least one instructor, please select an instructor', 400));
    }

    // If the instructors have changed, update the instructors' course arrays
    if (instructor) {
        const previousInstructors = course.instructor;

        // Validate the new instructors
        const validInstructors = await Instructor.find({
            instructor: { $in: instructor }, // Use the correct field '_id'
            drivingSchool: drivingSchool._id
        });

        if (validInstructors.length !== instructor.length) {
            return next(new errorHandler('One or more instructors are invalid or do not belong to your Driving School', 400));
        }

        // Remove the course ID from the previous instructors' courses array
        await Promise.all(previousInstructors.map(async (instId) => {
            const inst = await Instructor.findOne({instructor:instId});            
            if (inst) { // Check if the instructor exists
                inst.courses.pull(course._id);
                await inst.save();
            }
        }));

        // Add the course ID to the new instructors' courses array
        await Promise.all(validInstructors.map(async (inst) => {
            inst.courses.push(course._id);
            await inst.save();
        }));

        course.instructor = instructor; // Replace the instructor list with the new one
    }

    // Update other fields if provided in the request
    if (title) course.title = title;
    if (description) course.description = description;
    if (duration) course.duration = duration;
    if (vehicles) course.vehicles = vehicles;
    if (services) course.services = services;

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        course
    });
});



