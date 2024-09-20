const catchAsyncError = require('../middlewares/catchAsyncError')
const { registerLearner, Course, Session } = require('../models/courseModel');
const errorHandler = require('../utils/errorHandler');
const Review = require('../models/reviewModel')
const Attendance = require('../models/attendanceModel')

// Create a new learner registration
exports.createRegistration = catchAsyncError(async (req, res, next) => {
    const { course } = req.params;

    const isAlreadyApplied = await registerLearner.findOne({
        learner: req.user.id,
        course
    })

    if (isAlreadyApplied) {
        return next(new errorHandler('You are already applied this course!', 400));

    }

    const drivingSchool = await Course.findById(course)

    // Create a new registration
    const newRegistration = await registerLearner.create({
        drivingSchool: drivingSchool.drivingSchool,
        course,
        learner: req.user.id,
    });

    res.status(201).json({
        success: true,
        registration: newRegistration,
    });
});

//Give Review if course is completed
exports.giveReview = catchAsyncError(async (req, res, next) => {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Fetch the course
    const course = await Course.findById(courseId).populate('sessions learners reviews');

    if (!course) {
        return next(new errorHandler('Course Not Found', 404));
    }

    // Create or update the review
    const { rating, comment } = req.body;
    let review = await Review.findOne({ course: courseId, user: userId });

    if (review) {
        review.rating = rating;
        review.comment = comment;
        await review.save();
    } else {
        review = await Review.create({
            course: courseId,
            user: userId,
            rating,
            comment,
        });

        course.reviews.push(review._id);
        await course.save();
    }

    res.status(201).json({
        success: true,
        review,
    });
});

// Get My Courses
exports.getMyCourses = catchAsyncError(async (req, res, next) => {
    // Find courses by learner ID and their statuses, populate course and drivingSchool fields
    const pendingCourse = await registerLearner.find({ learner: req.user.id, status: 'Pending' })
        .populate({
            path: 'course',
            select: 'title description duration',
        })
        .populate({
            path: 'drivingSchool',
            select: 'drivingSchoolName location avatar',
        });

    const rejectedCourse = await registerLearner.find({ learner: req.user.id, status: 'Rejected' })
        .populate({
            path: 'course',
            select: 'title description duration',
        })
        .populate({
            path: 'drivingSchool',
            select: 'drivingSchoolName location avatar',
        });

    const approvedCourse = await registerLearner.find({ learner: req.user.id, status: 'Approved' })
        .populate({
            path: 'course',
            select: 'title description duration',
        })
        .populate({
            path: 'drivingSchool',
            select: 'drivingSchoolName location avatar',
        });

    // Check if all arrays are empty
    if (!pendingCourse.length && !rejectedCourse.length && !approvedCourse.length) {
        return res.status(200).json({
            success: true,
            message: "No courses found",
            courses: []
        });
    }

    // Send response with the populated courses
    res.status(200).json({
        success: true,
        pendingCourse,
        rejectedCourse,
        approvedCourse
    });
});

//Get My session
exports.getLearnerSessions = catchAsyncError(async (req, res, next) => {
    const sessions = await Session.find({ learner: req.user.id })
        .populate({
            path: 'course',
            select: 'title description duration',
        })
        .populate({
            path: 'instructor',
            select: 'name email avatar',
        });

    if (!sessions.length) {
        return res.status(200).json({
            success: true,
            message: "No sessions found for this learner",
            sessions: [],
        });
    }
    res.status(200).json({
        success: true,
        sessions,
    });
});

exports.getLearnerAttendance = catchAsyncError(async (req, res, next) => {
    const getAtt = await Attendance.find({ session: req.params.sessionId })

    if (!getAtt) {
        return next(new errorHandler('Course Not Found', 404));
    }

    const formattedAttendances = getAtt.map(attendance => {
        const Date = attendance.date.toLocaleDateString('en-US', {
            day: 'numeric',   // Day of the month (e.g., 1)
        });

        const Day = attendance.date.toLocaleDateString('en-US', {
            weekday: 'long',  // Day of the week (e.g., Monday)
        });

        const Month = attendance.date.toLocaleDateString('en-US', {
            month: 'long',    // Month name (e.g., January)
        });

        const formattedDate = { Date, Day, Month }

        return {
            ...attendance._doc, 
            formattedDate,      
        };
    });
    res.status(200).json({
        success: true,
        attendances:formattedAttendances,
    });
})