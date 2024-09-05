const catchAsyncError = require('../middlewares/catchAsyncError') 
const {registerLearner, Course, Session} = require('../models/courseModel'); 
const errorHandler = require('../utils/errorHandler');
 const Review = require('../models/reviewModel')

// Create a new learner registration
exports.createRegistration = catchAsyncError(async (req, res, next) => {
    const {course} = req.params;

    const isAlreadyApplied = await registerLearner.findOne({
        learner:req.user.id,
        course
    })

    if(isAlreadyApplied){
        return next(new errorHandler('You are already applied this course!', 400));

    }

    const drivingSchool = await Course.findById(course)

    // Create a new registration
    const newRegistration = await registerLearner.create({
        drivingSchool : drivingSchool.drivingSchool,
        course,
        learner : req.user.id,
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

    // Check if the user is a learner in the course
    const isLearnerEnrolled = course.learners.some(learner => learner.learner.toString() === userId.toString());

    if (!isLearnerEnrolled) {
        return next(new errorHandler('You are not enrolled in this course', 403));
    }

    // Check if the user has completed all sessions
    const sessions = await Session.find({ course: courseId, learner: userId });

    const hasCompletedSessions = sessions.every(session => session.status === 'Completed');

    if (!hasCompletedSessions) {
        return next(new errorHandler('You have not completed this course', 403));
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

