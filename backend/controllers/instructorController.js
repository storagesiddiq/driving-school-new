
const catchAsyncError = require("../middlewares/catchAsyncError");
const errorHandler = require("../utils/errorHandler");
const Instructor = require('../models/instructorModel')
const { Course, Session } = require('../models/courseModel');
const scheduleSession = require("../utils/scheduleSession");
const Attendance = require('../models/attendanceModel');
const sendEmail = require("../utils/email");
const Report = require('../models/reportModel')
const UserModel = require('../models/UserModel')

//see All my associated courses
exports.getMyProfile = catchAsyncError(async (req, res, next) => {
    const instructor = await Instructor.findOne({ instructor: req.user.id })
        .populate({
            path: 'drivingSchool',
            select: 'drivingSchoolName avatar location bannerImg about owner courses',
            populate: { path: 'owner', select: 'avatar name email phoneNumber' }
        })
        .populate('instructor', 'avatar name email phoneNumber')
        .populate({
            path: 'courses',
            select: 'title description duration ratings',
            populate: [
                { path: 'vehicles', select: 'name availability nextServiceDate lastServiceDate type registrationNumber' },
                { path: 'services', select: 'serviceName serviceType vehicleType description price certificatesIssued' },
                { path: 'learners', select: 'name email avatar phoneNumber' },
                { path: 'sessions', select: 'sessionDate sessionTime sessionInstructor' },
                { path: 'reviews', select: 'rating comment reviewerName' }
            ]
        });

    if (!instructor) {
        return next(new errorHandler('Instructor not found!', 404));
    }

    res.status(200).json({
        success: true,
        instructor,
    });
});

//GET All Registered and approve users of your associated courses
exports.getAllRegUsersMyCourse = catchAsyncError(async (req, res, next) => {
    // Find all courses where the logged-in user is an instructor
    const courses = await Course.find({
        instructor: req.user.id,
    })
        .populate({
            path: 'learners', // Populating the learners array in the course
            populate: [
                {
                    path: 'learner', // Populating the learner field in each registered learner
                    select: 'name email phoneNumber avatar',
                },
                {
                    path: 'course', // Populating the course field in each registered learner
                    select: 'title description duration',
                }
            ]
        });

    // Extract learners from each course
    const learners = courses.map(course => course.learners).flat();

    res.status(200).json({
        success: true,
        learners,
        courses
    });
});


/* ************************* SESSION ********************************** */

//Create sessions by instructor of course
exports.createSession = catchAsyncError(async (req, res, next) => {
    const { learner, startDate, startTime, endTime } = req.body;

    // Find the related course to validate learner
    const course = await Course.findById(req.params.courseId);

    if (!course) {
        return next(new errorHandler('Course not found', 404));
    }

    // Check if the learner ID is in the course's learners array
    const isLearnerRegistered = course.learners.some(
        (registeredLearner) => registeredLearner.learner.toString() === learner.toString()
    );

    if (!isLearnerRegistered) {
        return next(new errorHandler('Learner is not registered for this course', 400));
    }

    // Format startDate to only include the date part
    const formattedStartDate = new Date(startDate);
    formattedStartDate.setHours(0, 0, 0, 0);

    // Calculate the endDate if not provided
    let endDate;
    if (req.body.endDate) {
        endDate = new Date(req.body.endDate);
    } else {
        const courseDurationInWeeks = course.duration; // Assuming course.duration is in weeks
        endDate = new Date(formattedStartDate);
        endDate.setDate(endDate.getDate() + courseDurationInWeeks * 7); // Calculate end date by adding duration in days
    }
    endDate.setHours(0, 0, 0, 0); // Ensure endDate also only includes the date part

    // Create a new session
    const session = await Session.create({
        course: req.params.courseId,
        learner,
        instructor: req.user.id,
        startDate: formattedStartDate,
        endDate,
        startTime, // Stored as string "HH:MM AM/PM"
        endTime // Stored as string "HH:MM AM/PM"
    });

    // Push the session ID to the related course
    course.sessions.push(session._id);
    await course.save();

    // Schedule session (if applicable, adjust as needed)
    await scheduleSession(session._id);

    res.status(201).json({
        success: true,
        session,
    });
});



// GET all sessions for a specific course
exports.getAllSessions = catchAsyncError(async (req, res, next) => {
    const courseId = req.params.courseId;

    // Find the course and populate sessions
    const course = await Course.findById(courseId).populate({
        path: 'sessions',
        populate: { path: 'learner instructor', select: 'name email' } // Populate learner and instructor details
    });

    if (!course) {
        return next(new errorHandler('Course not found', 404));
    }

    res.status(200).json({
        success: true,
        sessions: course.sessions,
    });
});

// GET a single session
exports.getSession = catchAsyncError(async (req, res, next) => {
    const sessionId = req.params.sessionId;

    // Find the session and populate details
    const session = await Session.findById(sessionId).populate('instructor', 'name email avatar');
    if (!session) {
        return next(new errorHandler('Session not found', 404));
    }

    res.status(200).json({
        success: true,
        session,
    });
});

// UPDATE a session
exports.updateSession = catchAsyncError(async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const { learner, startDate, startTime, endTime, courseId } = req.body;

    // Find the related course to validate learner
    const course = await Course.findById(courseId);

    if (!course) {
        return next(new errorHandler('Course not found', 404));
    }

    const formattedStartDate = new Date(startDate);
    formattedStartDate.setHours(0, 0, 0, 0);

    // Calculate the endDate if not provided
    let endDate;
    if (req.body.endDate) {
        endDate = new Date(req.body.endDate);
    } else {
        const courseDurationInWeeks = course.duration; // Assuming course.duration is in weeks
        endDate = new Date(formattedStartDate);
        endDate.setDate(endDate.getDate() + courseDurationInWeeks * 7); // Calculate end date by adding duration in days
    }
    endDate.setHours(0, 0, 0, 0); // Ensure endDate also only includes the date part

    // Find and update the session
    const session = await Session.findByIdAndUpdate(sessionId, {
        course: req.params.courseId,
        learner,
        instructor: req.user.id,
        startDate: formattedStartDate,
        endDate,
        startTime,
        endTime
    }, { new: true, useFindAndModify: false });

    if (!session) {
        return next(new errorHandler('Session not found', 404));
    }

    await scheduleSession(session._id)

    res.status(200).json({
        success: true,
        session,
    });
});

// DELETE a session
exports.deleteSession = catchAsyncError(async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const courseId = req.body.courseId;

    // Find and delete the session
    const session = await Session.findByIdAndDelete(sessionId);

    if (!session) {
        return next(new errorHandler('Session not found', 404));
    }

    // Find the related course and pull the session ID
    await Course.findByIdAndUpdate(
        courseId,
        { $pull: { sessions: sessionId } },
        { new: true, useFindAndModify: false }
    );

  await Attendance.deleteMany({
        session:session._id,
    })



    res.status(200).json({
        success: true,
        message: 'Session deleted successfully',
    });
});

/* ************** ATTENDANCE ******************** */
// update attendance
exports.updateAttendance = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status field
    if (!['Present', 'Absent', 'idle'].includes(status)) {
        return next(new errorHandler('Invalid status value', 400));
    }

    const attendance = await Attendance.findById(id);

    if (!attendance) {
        return next(new errorHandler('Attendance record not found', 404));
    }

    // Update the status
    attendance.status = status;
    await attendance.save();

    res.status(200).json({
        success: true,
        message: 'Attendance status updated successfully',
        attendance
    });
})

//Get All attendance by month 
exports.getAttendances = catchAsyncError(async (req, res, next) => {
    const attendances = await Attendance.find({ session: req.params.sessionId });

    // Format the date field to include day and month name
    const formattedAttendances = attendances.map(attendance => {
        const Date = attendance.date.toLocaleDateString('en-US', {
            day: 'numeric',   // Day of the month (e.g., 1)
        });

        const Day = attendance.date.toLocaleDateString('en-US', {
            weekday: 'long',  // Day of the week (e.g., Monday)
        });

        const Month = attendance.date.toLocaleDateString('en-US', {
            month: 'long',    // Month name (e.g., January)
        });

        const formattedDate = {Date, Day, Month}

        return {
            ...attendance._doc, // Spread the existing fields of the attendance document
            formattedDate,      // Add the formatted date field
        };
    });

    res.status(200).json({
        success: true,
        attendances: formattedAttendances,
    });
});

//Generate Report  = body > remarks, learnerId, courseId
exports.createReport = catchAsyncError(async (req, res, next) => {
    const { remarks } = req.body;
    const instructorId = req.user.id;

    // Fetch the session for the course and learner
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
        return next(new errorHandler('Session not found', 404));
    }

    // Check if a report for this session already exists
    let report = await Report.findOne({ session: req.params.sessionId });

    if (report) {
        // Report already exists, just send the email notification
        const learner = await UserModel.findById(session.learner);
        if (!learner) {
            return next(new errorHandler('Learner not found', 404));
        }

        const message = `
            Dear ${learner.name},

            Your course report has been previously generated.

            Course: ${session.course}
            Instructor: ${instructorId}
            Completion Status: ${report.completionStatus}
            Grade: ${report.grade || 'N/A'}
            Remarks: ${report.remarks || 'No remarks'}

            Best regards,
            The Driving School Team
        `;

        await sendEmail({
            email: learner.email,
            subject: `Course Report for ${session.course}`,
            message,
        });

        return res.status(200).json({
            success: true,
            message: 'Report already exists. Email notification sent.',
            report,
        });
    }

    // If no report exists, calculate attendance and create a new report
    const totalSessions = await Attendance.countDocuments({
        session: session._id,
    });

    const completedSessions = await Attendance.countDocuments({
  session: session._id,
        status: 'Present',
    });

    const attendancePercentage = (completedSessions / totalSessions) * 100;

    // Determine completion status and grade
    const completionStatus = attendancePercentage >= 75 ? 'Completed' : 'Not Completed';
    let grade;
    if (completionStatus === 'Completed') {
        if (attendancePercentage >= 90) grade = 'A';
        else if (attendancePercentage >= 80) grade = 'B';
        else if (attendancePercentage >= 70) grade = 'C';
        else if (attendancePercentage >= 60) grade = 'D';
        else grade = 'F';
    }

    // Create the report
    report = await Report.create({
        session: req.params.sessionId,
        completionStatus,
        grade: completionStatus === 'Completed' ? grade : undefined,
        remarks,
    });

    // Fetch the learner's email for notification
    const learner = await UserModel.findById(session.learner);
    if (!learner) {
        return next(new errorHandler('Learner not found', 404));
    }

    const message = `
        Dear ${learner.name},

        Your course report has been generated.

        Course: ${session.course}
        Instructor: ${instructorId}
        Completion Status: ${completionStatus}
        Grade: ${grade || 'N/A'}
        Remarks: ${remarks || 'No remarks'}

        Best regards,
        The Driving School Team
    `;

    await sendEmail({
        email: learner.email,
        subject: `Course Report for ${session.course}`,
        message,
    });

    res.status(201).json({
        success: true,
        report,
        attendancePercentage,
    });
});

//Get All reports
exports.getAllReports = catchAsyncError(async (req, res, next) => {
    // Fetch reports where the session's instructor is the logged-in user
    const reports = await Report.find({})
        .populate({
            path: 'session',
            match: { instructor: req.user.id },  // Filter sessions by instructor
            populate: [
                {
                    path: 'learner',
                    model: 'User',
                    select: 'name email avatar phoneNumber',
                },
                {
                    path: 'instructor',
                    model: 'User',
                    select: 'name email avatar',
                },
                {
                    path: 'course',
                    model: 'Course',
                    select: 'name drivingSchool description ratings',
                }
            ]
        });

    // Filter out reports where the session is not populated (instructor didn't match)
    const filteredReports = reports.filter(report => report.session);

    res.status(200).json({
        success: true,
        reports: filteredReports,
    });
});


exports.getSingleReport = catchAsyncError(async (req, res, next) => {
    const report = await Report.findById(req.params.reportId)
        .populate({
            path: 'session',
            populate: [
                {
                    path: 'learner',
                    model: 'User',  // Correct model name
                    select: 'name email avatar phoneNumber',
                },
                {
                    path: 'instructor',
                    model: 'User',  // Correct model name
                    select: 'name email avatar',
                },
                {
                    path: 'course',
                    model: 'Course',  // Correct model name
                    populate: {
                        path: 'drivingSchool',
                        model: 'drivingSchool',  // Correct model name
                        select: 'drivingSchoolName avatar bannerImg location about',
                    }
                }
            ]
        });

    if (!report) {
        return next(new errorHandler('Report not found', 404));
    }

    res.status(200).json({
        success: true,
        report,
    });
});

