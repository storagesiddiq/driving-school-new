const { generateRandomPassword } = require('../utils/generateRandomPassword');
const CatchAsyncError = require('../middlewares/catchAsyncError')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/UserModel');
const sendEmail = require('../utils/email')
const DrivingSchool = require('../models/drivingSchoolModel')
const path = require('path')
const { getImageUrl, deleteImage } = require('../utils/handleImageUrl');
const fs = require('fs');
const Instructor = require('../models/instructorModel')
const { registerLearner } = require('../models/courseModel')
const { Course } = require('../models/courseModel')
const LearnerModel = require('../models/learnerModel');

// Get Driving School - /api/my-driving-school
exports.getMySchool = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id })
        .populate('owner', 'avatar name email phoneNumber')

    const course = await Course.find({ drivingSchool: drivingSchool._id })
    const Instructors = await Instructor.find({ drivingSchool: drivingSchool._id })
        .populate('instructor', 'avatar email name')

    if (!drivingSchool) {
        return next(new errorHandler('You\'re not the owner of any Driving School', 404))
    }

    res.status(200).json({ success: true, drivingSchool, course, Instructors });
});

// Update Driving School - /api/update-driving-school
exports.updateMySchool = CatchAsyncError(async (req, res, next) => {
    // Find the driving school owned by the logged-in user
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('You are not the owner of any Driving School', 404));
    }

    // Filter the req.body to allow only specific fields to be updated
    const allowedUpdates = ['drivingSchoolName', 'about', 'location']; // Add any other fields you want to allow
    const updatedDetails = {};

    allowedUpdates.forEach((field) => {
        if (req.body[field]) {
            updatedDetails[field] = req.body[field];
        }
    });

    // Perform the update operation
    const updatedDrivingSchool = await DrivingSchool.findByIdAndUpdate(
        drivingSchool._id,
        updatedDetails,
        { new: true, runValidators: true }
    );

    if (!updatedDrivingSchool) {
        return next(new errorHandler('Failed to update the Driving School', 500));
    }

    // Respond with the updated driving school details
    res.status(200).json({
        success: true,
        message: 'Driving School updated successfully',
        drivingSchool: updatedDrivingSchool
    });
});
//update images = avatar 
exports.patchMySchoolAvatar = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('You\'re not the owner of any Driving School', 404));
    }

    const updatedDetails = {};

    // Handle file upload
    if (req.file) {
        if (req.file.fieldname === 'avatar') {
            if (drivingSchool.avatar) {
                const oldAvatarPath = path.join(__dirname, '..', 'uploads/user', path.basename(drivingSchool.avatar));
                if (fs.existsSync(oldAvatarPath)) {
                    deleteImage(oldAvatarPath);
                }
            }
            updatedDetails.avatar = getImageUrl(req, req.file, 'user');
        }
    } else {
        return res.status(400).json({
            success: false,
            message: 'No valid file provided.'
        });
    }

    // Perform the update operation only if there are changes to be made
    if (Object.keys(updatedDetails).length > 0) {
        const updatedDrivingSchool = await DrivingSchool.findByIdAndUpdate(
            drivingSchool._id,
            updatedDetails,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Driving School updated successfully',
            drivingSchool: updatedDrivingSchool
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'No updates were provided.'
        });
    }
});

//update images = banner 
exports.patchMySchoolBanner = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('You\'re not the owner of any Driving School', 404));
    }

    const updatedDetails = {};

    // Handle file upload
    if (req.file) {
        if (req.file.fieldname === 'bannerImg') {
            if (drivingSchool.bannerImg) {
                const oldAvatarPath = path.join(__dirname, '..', 'uploads/banners', path.basename(drivingSchool.bannerImg));
                if (fs.existsSync(oldAvatarPath)) {
                    deleteImage(oldAvatarPath);
                }
            }
            updatedDetails.bannerImg = getImageUrl(req, req.file, 'banners');
        }
    } else {
        return res.status(400).json({
            success: false,
            message: 'No valid file provided.'
        });
    }

    // Perform the update operation only if there are changes to be made
    if (Object.keys(updatedDetails).length > 0) {
        const updatedDrivingSchool = await DrivingSchool.findByIdAndUpdate(
            drivingSchool._id,
            updatedDetails,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Driving School updated successfully',
            drivingSchool: updatedDrivingSchool
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'No updates were provided.'
        });
    }
});

// /* ********************* INSTRUCTORS ***************************************** */

//Create Instructor by Driving School owner
exports.createInstructor = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id })

    const { name, email, phoneNumber } = req.body;

    // Generate a random password
    const password = generateRandomPassword();
    try {
        //create user
        const instructor = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role: 'instructor',
        });

        const createInstructor = await Instructor.create({
            instructor: instructor._id,
            drivingSchool: drivingSchool._id
        });

        if (createInstructor) {
            const message = `
            Dear ${name},

            Congratulations! Your're an Instructor ${drivingSchool.drivingSchoolName} for  has been successfully created.

            You can now log in with the following credentials:

            Email: ${email}
            Password: ${password}

            Please keep this information secure. You can change your password after logging in for the first time.

            Best regards,
            The Driving School Team
        `;
            console.log(password);

            await sendEmail({
                email: email,
                subject: `${name}, you have been associated as an instructor for ${drivingSchool.drivingSchoolName} Driving School!`,
                message,
            });

            res.status(201).json({
                success: true,
                message: 'Instructor created successfully. An email with login details has been sent.',
                drivingSchool,
            });
        }
    } catch (err) {
        return next(err);

    }
})

// Delete Instructor by Driving School owner
exports.deleteInstructor = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
        return next(new errorHandler('Instructor not found. Please provide a correct ID.', 404));
    }

    if (!instructor.drivingSchool.equals(drivingSchool._id)) {
        return next(new errorHandler('You cannot delete this instructor because they do not belong to your school.', 403));
    }

    if (instructor.courses.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete this instructor, this instructor is assosiated with some courses ',
        })
    }

    // Delete the instructor
    await instructor.deleteOne();
    await User.findByIdAndDelete(instructor.instructor)

    // Respond with a success message
    res.status(200).json({
        success: true,
        message: 'Instructor deleted successfully',
    });
});

//get All Instructors  by Driving School owner
exports.getAllInstructors = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    const instructors = await Instructor.find({ drivingSchool: drivingSchool._id })
        .populate('drivingSchool', 'drivingSchoolName avatar location')
        .populate('instructor', 'avatar name email phoneNumber');

    // Calculate attendance percentage for each instructor
    const instructorsWithAttendance = instructors.map(instructor => {
        const totalAttendanceDays = instructor.attendance.length;
        const totalPresentDays = instructor.attendance.filter(att => att.status === 'Present').length;

        const attendancePercentage = totalAttendanceDays > 0 ? (totalPresentDays / totalAttendanceDays) * 100 : 0;

        return {
            ...instructor.toObject(),
            totalAttendanceDays,
            totalPresentDays,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2)) // Remove unnecessary zeros
        };
    });

    // Respond with a success message
    res.status(200).json({
        success: true,
        instructors: instructorsWithAttendance
    });
});


// Get a specific Instructor by ID for the Driving School owner
exports.getInstructorById = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    const instructor = await Instructor.findOne({ _id: req.params.id, drivingSchool: drivingSchool._id })
        .populate('instructor', 'avatar name email ')
        .populate('courses', 'title duration description ratings');

    if (!instructor) {
        return next(new errorHandler('Instructor not found or does not belong to your Driving School', 404));
    }

    // Calculate total attendance days and total present days
    const totalAttendanceDays = instructor.attendance.length;
    const totalPresentDays = instructor.attendance.filter(att => att.status === 'Present').length;

    // Calculate attendance percentage
    const attendancePercentage = totalAttendanceDays > 0 ? (totalPresentDays / totalAttendanceDays) * 100 : 0;

    // Respond with a success message
    res.status(200).json({
        success: true,
        instructor,
        totalAttendanceDays,
        totalPresentDays,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
    });
});

//Take Attendance for instructor
exports.takeInstructorAttendance = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { date, status } = req.body;

    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }
    // Check if the driving school owner is the one recording the attendance
    const instructor = await Instructor.findOne({ _id: id, drivingSchool: drivingSchool._id });

    if (!instructor) {
        return next(new errorHandler('Instructor not found or does not belong to your Driving School', 404));
    }

    // Check if attendance for the date already exists
    const existingAttendance = instructor.attendance.find(att =>
        new Date(att.date).toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
        existingAttendance.status = status;
        existingAttendance.recordedBy = req.user.id;
    } else {
        // Add new attendance record
        instructor.attendance.push({
            date: new Date(date),
            status,
            recordedBy: req.user.id,
        });
    }

    await instructor.save();

    res.status(200).json({
        success: true,
        message: 'Attendance recorded successfully',
        attendance: instructor.attendance
    });
})

// /* ********************** Registered Learners ***************************************** */
//Get All Registered Learners
exports.getAllRegisteredLearners = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }
    const registeredLearners = await registerLearner.find({ drivingSchool: drivingSchool._id })
        .populate('learner', 'name phoneNumber email avatar')
        .populate('course', 'title description duration');

    res.status(200).json({
        success: true,
        registeredLearners,
    });
})

// Get registered learner by ID with nested population
exports.getRegisteredLearnerById = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    const { id } = req.params;

    const RegisteredLearner = await registerLearner.findOne({ _id: id, drivingSchool: drivingSchool._id })
        .populate(
            'learner', 'name email avatar phoneNumber')
        .populate({
            path: 'course',
            populate: [
                { path: 'vehicles', select: 'name type registrationNumber' }, // Populate vehicles details from course
                { path: 'services', select: 'serviceName serviceType price' },
            ],
            select: 'title description duration',
        });

    const learnerDetails = await LearnerModel.findOne({ user: RegisteredLearner.learner })

    if (!learnerDetails) {
        return next(new errorHandler('Learner not found', 404));
    }
    if (!RegisteredLearner) {
        return next(new errorHandler('Registered learner not found', 404));
    }


    res.status(200).json({
        success: true,
        RegisteredLearner,
        details: learnerDetails
    });
});

// Update status of registered learner
exports.updateRegisteredLearnerStatus = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const drivingSchool = await DrivingSchool.findOne({ owner: req.user.id });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found or you are not the owner', 404));
    }

    console.log(status);
    
    // Validate the status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return next(new errorHandler('Invalid status provided', 400));
    }

    let registeredLearner = await registerLearner.findOne({ _id: id, drivingSchool: drivingSchool._id })

    if (!registeredLearner) {
        return next(new errorHandler('Registered learner not found', 404));
    }

    const course = await Course.findById(registeredLearner.course)

    if (!course) {
        return next(new errorHandler('Course not found', 404));
    }

    // Update course learners based on status
    const isLearnerInCourse = course.learners.some(learner => learner.equals(registeredLearner._id));
    console.log(isLearnerInCourse);
    console.log(registeredLearner._id);

    if (status === 'Approved') {
        if (isLearnerInCourse) {
            return next(new errorHandler('Learner is already approved for this course', 400));
        }
        course.learners.push({
            _id: registeredLearner._id,
            learner: registeredLearner.learner,
            course: registeredLearner.course,
            drivingSchool: registeredLearner.drivingSchool,
            status: status
        })
    } 
    // Save the updated course document
    await course.save();
    registeredLearner.status = status;
    await registeredLearner.save();

    res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        registeredLearner,
    });
});